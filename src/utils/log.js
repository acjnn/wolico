const Log = require('../models/log');


const TYPE = Object.freeze({
    API: 'API',
    JOB: 'JOB',
    OTHER: 'OTHER'
})


/** LOGGING TO POSTGRES */
const log = async (source, type, body) => {
    if (!Object.values(TYPE).includes(type)) {
        console.error('Invalid log type:', type);
        return;
    }
    try {
        await Log.create({
            source: source,
            type: type,
            body: body
        });
    } catch (error) {
        console.error('Error logging to database:', error);
    }
};


/** MODULE EXPORT */
module.exports = {
    TYPE,
    log
};