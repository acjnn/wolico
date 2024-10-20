import { logJob } from "../utils/log.js";
import { TYPE } from "../models/log.js";



export async function main(jobId) {
    try {
        if (!jobId) throw new Error('Job ID is missing');
        await logJob(jobId, TYPE.JOB, 'This is a test job.');

        // Async wait test
        await new Promise((resolve) =>
            setTimeout(resolve, 3000)
        );
        await logJob(jobId, TYPE.JOB, `Simulating a job run...`);

        await new Promise((resolve) =>
            setTimeout(resolve, 3000)
        );
        await logJob(jobId, TYPE.JOB, `Test completed successfully!`);

        process.exit(0); // simulate job complete
    } catch (error) {
        console.error(`Job failed: ${error.message}`);
        process.exit(1); // simulate job fail
    }
}


if (process.argv[2]) {
    main(process.argv[2]);
}