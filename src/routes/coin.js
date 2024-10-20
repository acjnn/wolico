const express = require("express");

const router = express.Router();





router.get('/top_movers', (req, res) => {
    return res.status(404).json({ message: "WIP" });
});

module.exports = router;
