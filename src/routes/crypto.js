const express = require("express");
const { Coin } = require('../models/coin');
const { Histo } = require('../models/histo');
const { Market } = require('../models/market');

const router = express.Router();

router.get('/top_movers', (req, res) => {
    return res.status(404).json({ message: "WIP" });
});

module.exports = router;
