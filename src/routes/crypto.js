const express = require("express");
const { Coin } = require('../models/coin');
const { Histo } = require('../models/histo');
const { Market } = require('../models/market');
const { postgres } = require('../DB');
const {Op} = require("sequelize");


const router = express.Router();


router.get('/top_movers', async (req, res) => {
    try {
        // Get last 3 days' biggest market cap changes
        /**
         * SELECT coin_id,
         *        SUM(market_cap_change_24h_usd) AS total_market_change
         * FROM Histo
         * WHERE date >= CURRENT_DATE - INTERVAL '3 day'
         *   AND market_cap_change_24h_usd IS NOT NULL
         * GROUP BY coin_id
         * ORDER BY total_market_change DESC
         * LIMIT 5;
         */
        const topMovers = await Histo.findAll({
            attributes: [
                'coin_id',
                [postgres.fn('SUM', postgres.col('market_cap_change_24h_usd')), 'total_market_change']
            ],
            where: {
                date: {
                    [Op.gte]: postgres.literal("CURRENT_DATE - INTERVAL '3 day'")
                },
                market_cap_change_24h_usd: {
                    [Op.not]: null
                }
            },
            group: ['coin_id'],
            order: [[postgres.literal('total_market_change'), 'DESC']],
            limit: 5
        });

        // Joined with Coin data to return more info
        const topMoversWithDetails = await Promise.all(
            topMovers.map(async (mover) => {
                const coin = await Coin.findOne({where: {id: mover.coin_id}});
                return {
                    ...coin.dataValues,
                    total_market_change: mover.dataValues.total_market_change
                };
            })
        );

        res.json(topMoversWithDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal Server Error'});
    }
});


router.get('/hottest', async (req, res) => {
    try {
        // Get top 5 coins based on price change
        const hottestCoins = await Histo.findAll({
            attributes: ['coin_id', 'price_change_percentage_24h'],
            where: {
                price_change_percentage_24h: {
                    [Op.not]: null
                }
            },
            order: [['price_change_percentage_24h', 'DESC']],
            limit: 5
        });

        // Join Coin data to return more info
        const hottestWithDetails = await Promise.all(
            hottestCoins.map(async (coin) => {
                const coinDetails = await Coin.findOne({where: {id: coin.coin_id}});
                return {
                    ...coinDetails.dataValues,
                    price_change_percentage_24h: coin.price_change_percentage_24h
                };
            })
        );

        res.json(hottestWithDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal Server Error'});
    }
});


module.exports = router;
