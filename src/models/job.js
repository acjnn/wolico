const { DataTypes } = require('sequelize');
const { postgres } = require('../DB');


/** JOBS ALLOWED STATES */
const STATUS = Object.freeze({
    PENDING: 'pending',
    RUNNING: 'running',
    COMPLETED: 'completed',
    FAILED: 'failed'
})


/** JOB SCHEMA */
const Job = postgres.define('Job', {
    jobId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    jobName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'running', 'completed', 'failed'),
        defaultValue: 'pending',
        allowNull: false
    },
    startTime: {
        type: DataTypes.DATE,
        allowNull: true
    },
    endTime: {
        type: DataTypes.DATE,
        allowNull: true
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
});


/** MODULE EXPORT */
module.exports = {
    STATUS,
    Job
};
