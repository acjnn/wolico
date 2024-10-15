const { DataTypes } = require('sequelize');
const { postgres } = require('../DB');


/** LOGGING TO POSTGRESQL */
const Log = postgres.define('Log', {
    date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
    source: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('API', 'JOB', 'OTHER'),
        allowNull: false
    },
    body: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});


/** MODULE EXPORT */
module.exports = Log;