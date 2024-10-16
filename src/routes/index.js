const fs = require('fs');
const path = require('path');


/** DYNAMIC API IMPORTING **/
const loadRoutes = () => {
    const routes = {};
    fs.readdirSync(__dirname)
        .filter(file => file !== 'index.js' && file.endsWith('.js'))
        .forEach(file => {
            const routeName = file.replace('.js', '');
            routes[`${routeName}`] = require(path.join(__dirname, file));
        });
    return routes;
};


/** MODULE EXPORT **/
module.exports = loadRoutes();