const { fork } = require('child_process');
const path = require('path');
const fs = require('fs');
const { Job, STATUS } = require('../models/job');


/** RUNS A GIVEN JOB */
const run = async (jobName, jobId) => {
    const jobPath = path.join(__dirname, '..', 'jobs', `${jobName}.js`);

    try {
        console.log('Starting Job:',jobId);
        await Job.create({
            jobId: jobId,
            jobName: jobName,
            status: STATUS.PENDING
        });

        // Fork process to run async
        const child = fork(jobPath, [jobId]);

        // Update state to 'running' + add time
        await Job.update(
            { status: STATUS.RUNNING, startTime: new Date() },
            { where: { jobId: jobId } }
        );

        child.on('error', (err) => {
            console.error(`Failed to start process: ${err.message}`);
        });

        child.on('close', async (code) => {
            const endTime = new Date();
            const duration = Math.round((endTime - (await Job.findOne({ where: { jobId } })).startTime) / 1000);
            await Job.update({
                status: code === 0 ? STATUS.COMPLETED : STATUS.FAILED,
                endTime: endTime,
                duration: duration
            }, {
                where: { jobId: jobId }
            });
            console.log(`${code?'Failed':'Completed'} Job:`,jobId);
        });

        // child.on('exit', () => {});
        // child.on('message', (msg) => {});
        // child.on('disconnect', () => {});
    } catch (error) {
        console.error(`Error in job runner for ${jobName}:`, error);
    }
};


/** LISTS ALL AVAILABLE JOBS */
const list = () => {
    const jobsDir = path.join(__dirname, '..', 'jobs');
    const jobFiles = fs.readdirSync(jobsDir);
    return jobFiles
        .filter(file => file.endsWith('.js'))
        .map(file => file.replace('.js',''));
};


/** MODULE EXPORT */
module.exports = {
    STATUS,
    run,
    list
};