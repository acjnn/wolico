/** ENVIRONMENT VARIABLES **/
require('dotenv').config();
console.log('App Started');


/** DEPENDENCIES IMPORTS **/
const cookieParser = require('cookie-parser')
const express = require('express');
const helmet  = require('helmet');
const morgan  = require('morgan');
const cors    = require('cors');
const DB      = require ('./DB');
console.log('Dependencies Imported');


/** API & DB IMPORT **/
// Importing all APIs and DB
const routes = require('./routes')();
const initDB = require('./utils/init');
console.log('APIs Imported');


/** INITIALIZATION **/
// Loading express
const app = express();

// Body parsing
app.use(express.json());

// Cookie parsing
app.use(cookieParser())

// Enable CORS
const origin = process.env.ORIGIN;
app.use(cors({
    origin: origin ? origin : true,
    credentials: !!origin,
    optionsSuccessStatus: 200
}));

// Basic security measures (!! should configure csp)
app.use(helmet({
    contentSecurityPolicy: false
}));

// Logging:
app.use(morgan('dev', {
    // Only 4xx and 5xx responses to console
    skip: function (req, res) { return res.statusCode < 400 }
}))

// More Logging (install a library to help in async writing) :
// app.use(morgan('common', {
//     stream: rotating-file-stream
// }))

console.log('App Initialized');


async function main() {
    try {
        // DATABASE CONNECTION
        await DB.connect();
        console.log(`Connected to Database`);

        // INITIALIZATION
        await initDB();

        // API LOADING
        let i = 0;
        Object.entries(routes).forEach(([path, route]) => {
            if (route instanceof express.Router) {
                console.log(`Loading ${path} api`);
                // Setting up route
                app.use(`/api/${path}`, route);
                i++;
            } else {
                console.error(`Failed to load route ${path}, not a Route. Received type: ${typeof route}`);
            }
        });
        console.log(`Loaded ${i} Routes`);

        // APPLICATION RUNNING
        const port = process.env.APP_PORT;
        // Port Selection
        app.listen(port, '0.0.0.0', () => {
            // Port Opened
            console.log('App listening on port: ' + port);
        });

        // APPLICATION QUITTING
        process.on('SIGTERM', async () => {
            try {
                await DB.close();
                console.log('App shutting down!');
                // Graceful Shutdown
                process.exit(0);
            } catch (error) {
                console.error('Error during shutdown:', error);
                process.exit(1);
                // Check connection pools
            }
        });

    } catch (e) {
        console.error('Failed to connect to the database:', e);
        process.exit(1);
    }
}


main();
