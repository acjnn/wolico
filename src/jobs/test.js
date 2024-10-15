export async function process() {
    console.log('This is an Example Job!');
    try {
        // Retrieve UUID from arguments
        const jobId = process.argv[2];
        if (!jobId)
            throw new Error('Job ID is missing');

        console.log(`Running job with ID: ${jobId}`);

        // Async wait test
        await new Promise((resolve) =>
            setTimeout(resolve, 5000)
        );

        console.log(`Job ${jobId} completed successfully!`);
        process.exit(0); // simulate completed
    } catch (error) {
        console.error(`Job failed: ${error.message}`);
        process.exit(1); // simulate failed
    }
}