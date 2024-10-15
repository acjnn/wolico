const express = require('express');
const Log = require('../models/log');
const router = express.Router();
const { Op } = require('sequelize');
const {TYPE} = require("../utils/log");


router.use(express.json());


/** RETRIEVE API LOGS **/
router.get('/api', async (req, res) => {
    const { source, startDate, endDate } = req.query;
    if (!startDate && !endDate)
        return res.status(400).json({error: 'Specify a date range'});

    // we should add isValidDate check

    let where = {};
    where.type = TYPE.API;
    if (source) where.source = source;
    if (startDate || endDate) {
        where.date = {};
        if (startDate) where.date[Op.gte] = new Date(startDate);
        if (endDate) where.date[Op.lte] = new Date(endDate);
        const twoMonths = 60 * 24 * 60 * 60 * 1000;
        if (end - start > twoMonths)
            return res.status(400).json({ error: 'Date range exceeds 2 months' });
    }

    try {
        const logs = await Log.findAll({
            where: where,
            order: [['date', 'DESC']]
        });
        res.status(200).json(logs);
    } catch (e) {
        console.error(e.toString());
        res.status(500).json({error: 'An error occurred'});
    }
});


/** RETRIEVE JOB LOGS **/
router.get('/job/:uuid', async (req, res) => {
    const { uuid } = req.params;
    if (!uuid)
        return res.status(400).json({error: 'Specify the job UUID'});;

    let where = {};
    where.type = TYPE.JOB;
    where.source = uuid;

    try {
        const logs = await Log.findAll({
            where: where,
            order: [['date', 'DESC']]
        });
        res.status(200).json(logs);
    } catch (e) {
        console.error(e.toString());
        res.status(500).json({error: 'An error occurred'});
    }
});


module.exports = router;