const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { run, list } = require('../utils/job');


const router = express.Router();


router.get('/run/:name', (req, res) => {
    const { name } = req.params;
    const jobId = uuidv4();
    // TODO
    // before running a job we should
    // check if there is a job where
    // status!='completed' and
    // not older than 3 days
    // if present we can assume there is
    // already a running instance
    // and return the jobId with state instead

    // Trigger job passing UUID
    run(name, jobId);

    // send back UUID
    res.status(200).json({ jobId, message: `Running Job ${name}` });
});


router.get('/list', (req, res) => {
    try {
        // FIXME
        // we should not only return the list of jobs but the state
        // so we know when a job is runnable or running
        const jobs = list();
        res.status(200).json({ jobs });
    } catch (error) {
        console.error('Error listing jobs:', error);
        res.status(500).json({ message: 'Failed to list jobs' });
    }
});

// TODO add a new route to check job state '/inspect/:id'
// we could additionally return the list of logs

module.exports = router;