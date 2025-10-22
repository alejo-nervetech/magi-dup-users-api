'use strict';

const jwt = require('jsonwebtoken');
const config = require('../../config');

const jwtToken = config.encryption.jwt.jwtToken;
const jwtExpiration = config.encryption.jwt.jwtExpiration;

function generateToken(payload, customJwtExpiration) {
    return jwt.sign(payload, jwtToken, {
        expiresIn: customJwtExpiration || jwtExpiration,
    });
}

function verifyToken(token) {
    return jwt.verify(token, jwtToken);
}

module.exports = { generateToken, verifyToken };
