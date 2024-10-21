import {logJob} from "../utils/log.js";
import {TYPE} from "../models/log.js";
import {Op} from "sequelize";
import {subtractDays, formatDate} from "../utils/dates.js";
import {Histo} from "../models/histo.js";
import {Coin} from "../models/coin.js";
import {Market} from "../models/market.js";

const jobId = process.argv[2];


async function calculateChangesForCoin(coin_id) {
    const histos = await Histo.findAll({
        where: { coin_id },
        order: [['date', 'ASC']]
    });

    if (histos.length < 2) return; // No delta calc possible with < 2 time points

    for (let i = 1; i < histos.length; i++) {
        const currentHisto = histos[i];
        const previousHisto = histos[i - 1];

        const daysDifference = Math.abs(new Date(currentHisto.date) - new Date(previousHisto.date)) / (1000 * 60 * 60 * 24);

        // Only calc 24h delta
        if (daysDifference === 1) {
            // Price delta
            const priceChange24hUsd = currentHisto.price_usd - previousHisto.price_usd;
            const priceChangePercentage24h = (priceChange24hUsd / previousHisto.price_usd) * 100;

            // Market cap delta
            const marketCapChange24hUsd = currentHisto.market_cap_usd - previousHisto.market_cap_usd;
            const marketCapChangePercentage24h = (marketCapChange24hUsd / previousHisto.market_cap_usd) * 100;

            // Update record with delta values
            await Histo.update({
                price_change_24h_usd: priceChange24hUsd,
                price_change_percentage_24h: priceChangePercentage24h,
                market_cap_change_24h_usd: marketCapChange24hUsd,
                market_cap_change_percentage_24h: marketCapChangePercentage24h
            }, {
                where: { coin_id: currentHisto.coin_id, date: currentHisto.date }
            });
        }
    }
}

async function calculateVolatility(coin_id) {
    const histos = await Histo.findAll({
        where: { coin_id },
        order: [['date', 'ASC']]
    });

    if (histos.length < 7) return; // No volatility calc possible with < 7 time points

    for (let i = 6; i < histos.length; i++) {
        const currentHisto = histos[i];

        // Check if we have 7 consecutive days
        const past7DaysHistos = [];
        for (let j = 0; j < 7; j++) {
            const previousHisto = histos[i - j];
            const daysDifference = Math.abs(new Date(currentHisto.date) - new Date(previousHisto.date)) / (1000 * 60 * 60 * 24);

            if (daysDifference === j) {
                past7DaysHistos.push(previousHisto);
            } else {
                break; // Not consecutive, skip this iteration
            }
        }

        // If we have exactly 7 consecutive days, calculate volatility
        if (past7DaysHistos.length === 7) {
            const priceChanges = past7DaysHistos.map(h => h.price_change_percentage_24h);
            const meanPriceChange = priceChanges.reduce((acc, val) => acc + val, 0) / priceChanges.length;
            const variance = priceChanges.reduce((acc, val) => acc + Math.pow(val - meanPriceChange, 2), 0) / priceChanges.length;
            const volatility7d = Math.sqrt(variance);

            // Update the current record with 7-day volatility
            await Histo.update({
                volatility_7d: volatility7d
            }, {
                where: { coin_id: currentHisto.coin_id, date: currentHisto.date }
            });
        }
    }
}


/** MAIN */
async function main() {
    await logJob(jobId, `Starting Price and Market Cap Change Calculation Job.`);

    // Find all distinct coins in the Histo table
    const distinctCoins = await Coin.findAll({
        attributes: ['id'],
        group: ['id']
    });

    for (const coin of distinctCoins) {
        await calculateChangesForCoin(coin.coin_id);
    }
    await logJob(jobId, `Completed Price and Market Cap Change Calculation Job.`);

    for (const coin of distinctCoins) {
        await calculateVolatility(coin.coin_id);
    }
    await logJob(jobId, `Completed Price and Market Cap Change Calculation Job.`);
}


/** PROCESS START */
if (process.argv[2]) {
    main();
} else {
    await logJob(jobId, `Could not start job.`, TYPE.ERROR);
    process.exit(1);
}