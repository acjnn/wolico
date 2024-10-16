const {Log, TYPE, SOURCE} = require("../models/log");


/** LOGGING TO POSTGRES */
const log = async (sourceID,sourceType,body,logType=TYPE.LOG) => {

    if (!Object.values(TYPE).includes(logType)) {
        console.error('Invalid log type:', logType);
        return;
    }

    if (!Object.values(SOURCE).includes(sourceType)) {
        console.error('Invalid log type:', sourceType);
        return;
    }

    try {
        await Log.create({
            sourceID: sourceID,
            sourceType: sourceType,
            logType: logType,
            body: body
        });
    } catch (error) {
        console.error('Error logging to database:', error);
    }
};

const logJob = async (sourceID,logType,body) => {
    await log(sourceID,SOURCE.JOB,body,logType);
}
const logApi = async (sourceID,logType,body) => {
    await log(sourceID,SOURCE.API,body,logType);
}
const logOther = async (sourceID,logType,body) => {
    await log(sourceID,SOURCE.OTHER,body,logType);
}

/** MODULE EXPORT */
module.exports = {
    logJob,
    logApi,
    logOther
};