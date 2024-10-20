const { DataTypes } = require("sequelize");
const { postgres } = require("../DB");


const Histo = postgres.define('Histo', {
    coin_id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        primaryKey: true,
    },
    price_usd: {
        type: DataTypes.FLOAT
    },
    market_cap_usd: {
        type: DataTypes.BIGINT
    },
    total_volume_usd: {
        type: DataTypes.BIGINT
    },

    // must add this data afterward (transform)
    // because api "history" doesn't have it...
    // and coins/data doesn't allow date param

    price_change_24h_usd: {
        type: DataTypes.FLOAT
    },
    price_change_percentage_24h: {
        type: DataTypes.FLOAT
    },
    market_cap_change_24h_usd: {
        type: DataTypes.BIGINT
    },
    market_cap_change_percentage_24h: {
        type: DataTypes.FLOAT
    },
    circulating_supply: {
        type: DataTypes.FLOAT
    },
    total_supply: {
        type: DataTypes.FLOAT
    },
    max_supply: {
        type: DataTypes.FLOAT
    }
}, {
    timestamps: false
});


module.exports = {
    Histo
};