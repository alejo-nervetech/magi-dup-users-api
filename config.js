'use strict';

require('dotenv').config();

const {
    PORT,
    CORS_ORIGIN,
    DB_NAME,
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASSWORD,
    JWT_TOKEN,
    SERVICE_SECRET,
    NODE_ENV,
} = process.env;

module.exports = {
    port: parseInt(PORT) || 3001,
    database: {
        host: DB_HOST,
        port: parseInt(DB_PORT) || 5432,
        name: DB_NAME,
        username: DB_USER,
        password: DB_PASSWORD,
    },
    encryption: {
        bcrypt: {
            saltRounds: 10,
        },
        jwt: {
            jwtExpiration: '24h',
            jwtToken: JWT_TOKEN,
        },
    },
    serviceSecret: SERVICE_SECRET,
    cors: CORS_ORIGIN ? CORS_ORIGIN.split(',') : [],
    env: NODE_ENV || 'development',
};
