import {log, SOURCE} from "../utils/log.js";


// We send this as param from the express app but we could also load
// dotenv.config({ path: path.resolve(__dirname, '../jobs/.env') });
const apiKey = process.env.CG_API;
const jobId = process.argv[2];
const urlBase = 'https://api.coingecko.com/api/v3/';


export async function main() {
    await log(jobId, 'Starting data extraction from Coin Gecko.', SOURCE.JOB);

    let data;
    try {
        const response = await fetch(`${urlBase}ping?x_cg_demo_api_key=${apiKey}`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);
        
        await log(jobId, 'Fetched Data.', SOURCE.JOB);
        data = await response.json();
    } catch (error) {
        console.error('Error:', error);
        await log(jobId, 'Error fetching data...', SOURCE.JOB);
        throw error;
    }
    
    if (!data) throw new Error('No data');
    
}


if (process.argv[2] && process.env.CG_API) {
    main();
}
