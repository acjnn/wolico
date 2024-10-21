const { DataTypes } = require('sequelize');
const { postgres } = require('../DB');


const Market = postgres.define('Market', {
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        primaryKey: true,
    },
    active_cryptocurrencies: {
        type: DataTypes.INTEGER
    },
    total_market_cap_usd: {
        type: DataTypes.DECIMAL(24, 4)
    },
    total_volume_usd: {
        type: DataTypes.DECIMAL(24, 4)
    },
    btc_market_cap_percentage: {
        type: DataTypes.DECIMAL(10, 4)
    },
    eth_market_cap_percentage: {
        type: DataTypes.DECIMAL(10, 4)
    },
    market_cap_change_percentage_24h_usd: {
        type: DataTypes.DECIMAL(10, 4)
    }
}, {
    timestamps: false
});


module.exports = {
    Market
};