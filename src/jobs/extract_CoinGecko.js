import {logJob} from "../utils/log.js";
import {TYPE} from "../models/log.js";
import {formatDate} from "../utils/dates.js";


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
        // await logJob(jobId,`Error fetching endpoint: ${endpoint}`, TYPE.ERROR);
        throw error;
    }
}

// Get all supported coins with price, market cap, volume and market data.
export async function getAllCoins(currency) {
    // await logJob(jobId, `Fetching all listed cryptocurrencies in ${currency}.`);
    return await fetchData(`coins/markets?vs_currency=${currency}`);
}

// Get trending coins, nfts and categories on CoinGecko of the day.
export async function getTrending() {
    // await logJob(jobId, `Fetching market trends.`);
    return await fetchData(`search/trending`);
}

// Get the historical data at a given date for a coin.
export async function getHistory(crypto,date) {
    const formattedDate = formatDate(date);
    // await logJob(jobId, `Fetching ${crypto}'s data on date: ${formattedDate}.`);
    return await fetchData(`coins/${crypto}/history?${formattedDate}`);
}

export async function main() {
    // get top 50 crypto using getAllCoins()
    // each coin in the array has "market_cap_rank"
    // upsert to db to update any rank change and
    // add missing coins


}


if (process.argv[2] && process.env.CG_API) {
    main();
} else {
    // await logJob(jobId, `Could not start job.\nPlease, add a coin gecko api key.`, TYPE.ERROR);
    process.exit(1);
}
