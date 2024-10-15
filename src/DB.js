const { Sequelize } = require('sequelize');


const postgres = new Sequelize(
    process.env.POSTGRES_URI,
    { dialect: 'postgres' , pool: { max:10, min:0, idle: 10000, acquire: 30000 }}
);


const connect = async () => {
    try {
        // Connect to PostgreSQL
        await postgres.authenticate();
        console.log('Connection to PostgreSQL has been established successfully.');

        // Creating tables
        await postgres.sync({force:false})
        console.log('Synced all models to PostgreSQL tables.');

        // More db can be added here...
    } catch (error) {
        console.error('Unable to connect to the database:\n', error);
        throw error;
    }
};


const close = async () => {
    try {
        // Close PostgreSQL connection
        await postgres.close();
        console.log('PostgreSQL connection has been closed successfully.');

        // If other connections are opened they should be closed here...
    } catch (error) {
        console.error('Error while disconnecting from the database:\n', error);
        throw error;
    }
};


module.exports = {
    postgres,
    connect,
    close
}