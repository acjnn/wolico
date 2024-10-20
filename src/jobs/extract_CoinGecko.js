import {logJob} from "../utils/log.js";
import {TYPE} from "../models/log.js";
import {formatDate} from "../utils/dates.js";


// We send this as param from the express app but we could also load
// dotenv.config({ path: path.resolve(__dirname, '../jobs/.env') });
const apiKey = process.env.CG_API;
const jobId = process.argv[2];
const urlBase = 'https://api.coingecko.com/api/v3/';

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

// Get all the coin data of a coin with a specific id.
export async function getCoinData(crypto) {
    await logJob(jobId, `Fetching ${crypto}'s data.`);
    return await fetchData(`coins/${crypto}`);
}

// Get trending coins, nfts and categories on CoinGecko of the day.
export async function getTrending() {
    await logJob(jobId, `Fetching market trends.`);
    return await fetchData(`search/trending`);
}

// Get the historical data at a given date for a coin.
export async function getHistory(crypto,date) {
    const formattedDate = formatDate(date);
    await logJob(jobId, `Fetching ${crypto}'s data on date: ${formattedDate}.`);
    return await fetchData(`coins/${crypto}/history?${formattedDate}`);
}

export async function main() {


}


if (process.argv[2] && process.env.CG_API) {
    main();
} else {
    await logJob(jobId, `Could not start job.\nPlease, add a coin gecko api key.`, TYPE.ERROR);
    process.exit(1);
}
