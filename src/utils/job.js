const { fork } = require('child_process');
const path = require('path');
const fs = require('fs');
const { Job, STATUS } = require('../models/job');



/** RUNS A GIVEN JOB */
const run = async (jobName, jobId) => {
    const jobPath = path.join(__dirname, 'jobs', `${jobName}.js`);

    try {
        const jobModule = require(jobPath);
        if (typeof jobModule.process !== 'function' || jobModule.process.constructor.name !== 'AsyncFunction')
            throw new Error(`Job ${jobName} does not export a valid async function 'process'.`);

        await Job.create({
            jobId: jobId,
            jobName: jobName,
            status: STATUS.PENDING
        });

        // Fork process to run async
        const child = fork(jobPath, [jobId]);

        // Update state to 'running' + add time
        await Job.update({ status: STATUS.RUNNING, startTime: new Date() }, { where: { jobId } });

        child.on('exit', async (code) => {
            // On job completion, update status to 'completed'/'failed'
            const endTime = new Date();
            const duration = Math.round((endTime - (await Job.findOne({ where: { jobId } })).startTime) / 1000);

            await Job.update({
                status: code === 0 ? STATUS.COMPLETED : STATUS.FAILED,
                endTime: endTime,
                duration: duration
            }, { where: { jobId } });
        });
    } catch (error) {
        console.error(`Error in job runner for ${jobName}:`, error);
    }
};


/** LISTS ALL AVAILABLE JOBS */
const list = () => {
    const jobsDir = path.join(__dirname, 'jobs');
    const jobFiles = fs.readdirSync(jobsDir);

    // Array of job filenames, no module load and check
    // this could list un-runnable jobs... potential fix
    // is creating a cache that it's refreshed every hour
    return jobFiles.map(file => ({
        name: file,
        path: path.join(jobsDir, file)
    }));
};


/** MODULE EXPORT */
module.exports = {
    STATUS,
    run,
    list
};