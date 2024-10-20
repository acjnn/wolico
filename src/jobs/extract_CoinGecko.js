import {logJob} from "../utils/log.js";
import {TYPE} from "../models/log.js";


// We send this as param from the express app but we could also load
// dotenv.config({ path: path.resolve(__dirname, '../jobs/.env') });
const apiKey = process.env.CG_API;
const jobId = process.argv[2];
const urlBase = 'https://api.coingecko.com/api/v3/';


async function fetchData(endpoint) {
    try {
        const response = await fetch(`${urlBase}${endpoint}x_cg_demo_api_key=${apiKey}`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
        if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        await logJob(jobId, `Error fetching data from endpoint: ${endpoint}`, TYPE.JOB);
        throw error;
    }
}

// Method to get historical data of a coin
export async function getCoinHistory(coinId, date) {
    await logJob(jobId, `Fetching historical data for ${coinId} on ${date}.`, TYPE.JOB);
    return await fetchData(`coins/${coinId}/history?date=${date}&`);
}

// Method to get today's prices for a specific coin
export async function getTodayPrice(coinId) {
    await logJob(jobId, `Fetching today's price for ${coinId}.`, TYPE.JOB);
    return await fetchData(`simple/price?ids=${coinId}&vs_currencies=usd&`);
}

// Method to get all listed cryptocurrencies
export async function getAllCoins() {
    await logJob(jobId, 'Fetching all listed cryptocurrencies.', TYPE.JOB);
    return await fetchData('coins/list?');
}

// Method to get market data for a coin (like market cap)
export async function getMarketData(coinId) {
    await logJob(jobId, `Fetching market data for ${coinId}.`, TYPE.JOB);
    return await fetchData(`coins/${coinId}?`);
}

// Method to get trending coins
export async function getTrendingCoins() {
    await logJob(jobId, 'Fetching trending coins.', TYPE.JOB);
    return await fetchData('search/trending?');
}


export async function main() {


}


if (process.argv[2] && process.env.CG_API) {
    main();
}
