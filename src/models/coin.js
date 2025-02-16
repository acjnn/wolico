const { DataTypes } = require('sequelize');
const { postgres } = require('../DB');


const Coin = postgres.define('Coin', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    symbol: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rank: {
        type: DataTypes.INTEGER
    },
    isTrending: {
        type: DataTypes.BOOLEAN
    }
}, {
    timestamps: false
});


module.exports = {
    Coin
};