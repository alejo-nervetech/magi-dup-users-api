'use strict';

const bcrypt = require('bcrypt');
const config = require('../../config');

const saltRounds = config.encryption.bcrypt.saltRounds;

async function hashPassword(password) {
    return await bcrypt.hash(password, saltRounds);
}

async function comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}

module.exports = { hashPassword, comparePassword };
