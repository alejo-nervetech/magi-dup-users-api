'use strict';

const config = require('../../../config');
const wrap = require('./response-helper');
const ms = require('ms');

class LoginResponseMapper {
    constructor(token) {
        const expirationDurationMs = ms(config.encryption.jwt.jwtExpiration);
        const expiration = Date.now() + expirationDurationMs;

        return wrap({
            token,
            expiresAt: expiration,
        });
    }
}

module.exports = LoginResponseMapper;
