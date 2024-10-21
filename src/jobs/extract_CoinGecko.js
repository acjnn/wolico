import {logJob} from "../utils/log.js";
import {TYPE} from "../models/log.js";
import {formatDate, subtractDays} from "../utils/dates.js";
import {Coin} from "../models/coin.js";
import {Op} from "sequelize";


// We use the app process env but we could load a local env:
// dotenv.config({ path: path.resolve(__dirname, '../jobs/.env') });
const apiKey = process.env.CG_API;
const jobId = process.argv[2];
const urlBase = 'https://api.coingecko.com/api/v3/';
const ccy = 'usd'

// Core Fetch Method
async function fetchData(endpoint) {
    try {
        const response = await fetch(`${urlBase}${endpoint}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'x-cg-demo-api-key': apiKey
            }
        });
        if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        await logJob(jobId,`Error fetching endpoint: ${endpoint}`, TYPE.ERROR);
        throw error;
    }
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
    await logJob(jobId, `Fetching market DAta.`);
    return await fetchData(`global`);
}

// Get the historical data at a given date for a coin.
export async function getHistory(crypto,date) {
    const formattedDate = formatDate(date);
    await logJob(jobId, `Fetching ${crypto}'s history for date: ${formattedDate}.`);
    return await fetchData(`coins/${crypto}/history?${formattedDate}`);
}

export async function main() {
    // get top 50 crypto using getAllCoins()
    // each coin in the array has "market_cap_rank"
    // we use that to order and filter rank > 50
    // only get the 'name' 'id' and 'symbol' data
    // put in db so it adds new coins and updates
    // already inserted coin's rank. we before-hand
    // reset any existing coin 'rank' and
    // 'trending' data to null to keep the db clean
    await Coin.update({ rank: null, isTrending: null }, { where: {} });
    const allCoins = await getAllCoins('usd');
    const topCoins = allCoins.filter(coin => coin.rank <= 50);

    for (const coin of topCoins) {
        await Coin.upsert({
            id: coin.id,
            symbol: coin.symbol,
            name: coin.name,
            rank: coin.rank
        });
    }
    // after that use the 'trending' api to extract
    // all trending data and only update the column
    // in the db of the already inserted coins that
    // have a rank (where rank != null)
    const trendingData = await getTrending();
    for (const trendingCoin of trendingData.coins) {
        const trending = trendingCoin.item;
        await Coin.update(
            { isTrending: true },
            { where: { id: trending.item.id, rank: { [Op.not]: null } } }
        );
    }
    // after that download the last 7 days of data
    // using the getHistory (starting from date.now)
    // of the coins that have a rank and are trending
    const rankedTrendingCoins = await Coin.findAll({ where: { rank: { [Op.not]: null }, isTrending: true } });
    const now = new Date();

    for (const coin of rankedTrendingCoins) {
        for (let i = 0; i < 7; i++) {
            const date = subtractDays(now, i);  // Get the date for each of the past 7 days
            const historyData = await getHistory(coin.id, date);

            await Histo.upsert({
                coin_id: coin.id,
                date: formatDate(date),
                price_usd: historyData.market_data.current_price.usd,
                market_cap_usd: historyData.market_data.market_cap.usd,
                total_volume_usd: historyData.market_data.total_volume.usd,
            });
        }
    }
    // finally use the getMarket to get todays
    // global market info
    const marketData = await getMarket();
    await Market.upsert({
        date: formatDate(now),
        active_cryptocurrencies: marketData.data.active_cryptocurrencies,
        total_market_cap_usd: marketData.data.total_market_cap.usd,
        total_volume_usd: marketData.data.total_volume.usd,
        btc_market_cap_percentage: marketData.data.market_cap_percentage.btc,
        eth_market_cap_percentage: marketData.data.market_cap_percentage.eth,
        market_cap_change_percentage_24h_usd: marketData.data.market_cap_change_percentage_24h_usd
    });
}


if (process.argv[2] && process.env.CG_API) {
    main();
} else {
    await logJob(jobId, `Could not start job.\nPlease, add a coin gecko api key.`, TYPE.ERROR);
    process.exit(1);
}
