import {log, TYPE} from "../utils/log.js";


export async function main(jobId) {
    try {
        if (!jobId) throw new Error('Job ID is missing');
        await log(jobId, 'This is a test job.', TYPE.JOB);

        // Async wait test
        await new Promise((resolve) =>
            setTimeout(resolve, 3000)
        );
        await log(jobId, `Simulating a job run...`, TYPE.JOB);

        await new Promise((resolve) =>
            setTimeout(resolve, 3000)
        );
        await log(jobId, `Test completed successfully!`, TYPE.JOB);

        process.exit(0); // simulate job complete
    } catch (error) {
        console.error(`Job failed: ${error.message}`);
        process.exit(1); // simulate job fail
    }
}


if (process.argv[2]) {
    main(process.argv[2]);
}