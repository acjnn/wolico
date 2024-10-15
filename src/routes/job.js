const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { run, list } = require('../utils/job');


const router = express.Router();


router.get('/run/:name', (req, res) => {
    const { name } = req.params;
    const jobId = uuidv4();

    // Trigger job passing UUID
    run(name, jobId);

    // send UUID
    res.status(200).json({ jobId, message: `Running Job ${name}, ID: ${jobId}` });
});


router.get('/list', (req, res) => {
    try {
        const jobs = list();
        res.status(200).json({ jobs });
    } catch (error) {
        console.error('Error listing jobs:', error);
        res.status(500).json({ message: 'Failed to list jobs' });
    }
});


module.exports = router;