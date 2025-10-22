'use strict';

require('dotenv').config();

const dbConfiguration = {
    database: process.env.DB_NAME,
    dialect: 'postgres',
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    dialectOptions: {
        useUTC: false,
    },
    timezone: '+08:00',
};

module.exports = {
    development: dbConfiguration,
    staging: dbConfiguration,
    test: dbConfiguration,
    uat: dbConfiguration,
    production: dbConfiguration,
};
