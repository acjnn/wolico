const { DataTypes } = require('sequelize');
const { postgres } = require('../DB');


const SOURCE = Object.freeze({
    API: 'API',
    JOB: 'JOB',
    OTHER: 'OTHER'
})

const TYPE = Object.freeze({
    ERROR: 'Error',
    LOG: 'Log',
    WARN: 'Warn',
    VERB: 'Verb'
})

/** LOGGING TO POSTGRESQL */
const Log = postgres.define('Log', {
    date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
    sourceID: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sourceType: {
        type: DataTypes.ENUM('API', 'JOB', 'OTHER'),
        allowNull: false
    },
    logType: {
        type: DataTypes.ENUM('Error', 'Log', 'Warn', 'Verb'),
        allowNull: true,
        defaultValue: 'Log'
    },
    body: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    timestamps: false
});


/** MODULE EXPORT */
module.exports = {
    SOURCE,
    TYPE,
    Log
};