'use strict';

const config = require('./../config');
const sequelizeConfig = require('./../sequelize/config/config')[config.env];
const { Sequelize } = require('sequelize');

module.exports = new Sequelize(
    sequelizeConfig.database,
    sequelizeConfig.username,
    sequelizeConfig.password,
    {
        host: sequelizeConfig.host,
        port: sequelizeConfig.port,
        dialect: sequelizeConfig.dialect,
    }
);
