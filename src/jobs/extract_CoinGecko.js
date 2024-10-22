import {logJob} from "../utils/log.js";
import {TYPE} from "../models/log.js";
import {formatDate, subtractDays} from "../utils/dates.js";
import {Coin} from "../models/coin.js";
import {Histo} from "../models/histo.js";
import {Market} from "../models/market.js";
import {Op} from "sequelize";

// We use the app process env but we could load a local env:
// dotenv.config({ path: path.resolve(__dirname, '../jobs/.env') });
const apiKey = process.env.CG_API;
const jobId = process.argv[2];
const urlBase = 'https://api.coingecko.com/api/v3/';
const rankThreshold = 100;
const timeLength = 30

// Core Fetch Method with retry
async function fetchData(endpoint) {
    const maxRetries = 5;
    let retries = 0;
    await new Promise(resolve => setTimeout(resolve, 500));
    while (retries < maxRetries) {
        const response = await fetch(urlBase+endpoint, {
            headers: {
                'x-cg-demo-api-key': apiKey
            }
        });
        if (response.status === 429) {
            const retryAfter = response.headers.get('Retry-After') || 1;
            await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
            retries++;
        } else if (response.ok) {
            return await response.json();
        } else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    }
    throw new Error('Max retries reached');
}

// Get all supported coins with price, market cap, volume and market data.
export async function getAllCoins(currency) {
    await logJob(jobId, `Fetching all listed cryptocurrencies in ${currency}.`);
    return await fetchData(`coins/markets?vs_currency=${currency}`);
}

// Get trending coins, nfts and categories on CoinGecko of the day.
export async function getTrending() {
    await logJob(jobId, `Fetching trending coins.`);
    return await fetchData(`search/trending`);
}

// Get total market catp and other global info.
export async function getMarket() {
    await logJob(jobId, `Fetching market Data.`);
    return await fetchData(`global`);
}

// Get the historical data at a given date for a coin.
export async function getHistory(crypto,date) {
    const formattedDate = formatDate(date);
    await logJob(jobId, `Fetching ${crypto}'s history for date: ${formattedDate}.`, TYPE.VERB);
    return await fetchData(`coins/${crypto}/history?date=${formattedDate}`);
}


/** MAIN */
export async function main() {
    const now = new Date();
    await logJob(jobId, `Starting Coin Gecko Data Extraction: ${formatDate(now)}`);

    // Fetch and store today's global market information.
    const marketData = await getMarket();
    await Market.upsert({
        date: now,
        active_cryptocurrencies: marketData.data.active_cryptocurrencies,
        total_market_cap_usd: marketData.data.total_market_cap.usd,
        total_volume_usd: marketData.data.total_volume.usd,
        btc_market_cap_percentage: marketData.data.market_cap_percentage.btc,
        eth_market_cap_percentage: marketData.data.market_cap_percentage.eth,
        market_cap_change_percentage_24h_usd: marketData.data.market_cap_change_percentage_24h_usd
    });
    await logJob(jobId, `Added global market data.`);

    // Get top 50 cryptocurrencies, update database with new coins and ranks.
    await Coin.update({ rank: null, isTrending: false }, { where: {} });
    const allCoins = await getAllCoins('usd');
    const topCoins = allCoins.filter(coin => coin.market_cap_rank <= rankThreshold);

    for (const coin of topCoins) {
        await Coin.upsert({
            id: coin.id,
            symbol: coin.symbol,
            name: coin.name,
            rank: coin.market_cap_rank
        });
    }
    await logJob(jobId, `Updated Coin Records.`);

    // Extract trending data and update trending status for ranked coins.
    const trendingData = await getTrending();
    for (const trendingCoin of trendingData.coins) {
        const trending = trendingCoin.item;
        if (!trending || !trending.id) continue;
        await Coin.update(
            { isTrending: true },
            // Instead of matching already present coins (ranked) we could just insert new coins
            // this would grow the list of available coins and potentially increase the time series download
            { where: { id: trending.id, rank: { [Op.not]: null } } }
        );
    }
    await logJob(jobId, `Updated Trending Coins.`);

    // Download last N days of historical data for ranked and trending coins.
    const rankedTrendingCoins = await Coin.findAll({ where: { rank: { [Op.not]: null }, isTrending: true } });
    // The above filtering could be very restrictive,
    // we could remove a condition to get more time series

    for (const coin of rankedTrendingCoins) {
        for (let i = 0; i < timeLength; i++) {
            const date = subtractDays(now, i);
            const existingHisto = await Histo.findOne({
                where: {
                    coin_id: coin.id,
                    date: date,
                }
            });
            if (existingHisto) {
                await logJob(jobId, `Skipping ${coin.id}'s history for date: ${formatDate(date)} as it already exists.`, TYPE.VERB);
                continue;
            }
            const historyData = await getHistory(coin.id, date);
            await Histo.upsert({
                coin_id: coin.id,
                date: date,
                price_usd: historyData.market_data.current_price.usd,
                market_cap_usd: historyData.market_data.market_cap.usd,
                total_volume_usd: historyData.market_data.total_volume.usd,
            });
        }
    }
    await logJob(jobId, `Added new historical data.`);

    // All Steps Done
    await logJob(jobId, `Process Completed.`);
}


/** PROCESS START */
if (process.argv[2] && apiKey) {
    main();
} else {
    await logJob(jobId, `Could not start job.\nPlease, add a coin gecko api key.`, TYPE.ERROR);
    process.exit(1);
}
