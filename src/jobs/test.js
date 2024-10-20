import { logJob } from "../utils/log.js";
import { TYPE } from "../models/log.js";



export async function main(jobId) {
    try {
        if (!jobId) throw new Error('Job ID is missing');
        await logJob(jobId, 'This is a test job.');

        // Async wait test
        await new Promise((resolve) =>
            setTimeout(resolve, 3000)
        );
        await logJob(jobId, `Simulating a job run...`);

        await new Promise((resolve) =>
            setTimeout(resolve, 3000)
        );
        await logJob(jobId, `Test completed successfully!`);

        process.exit(0); // simulate job complete
    } catch (error) {
        await logJob(jobId, `Job failed: ${error.message}`, TYPE.ERROR);
        process.exit(1); // simulate job fail
    }
}


if (process.argv[2]) {
    main(process.argv[2]);
}