'use strict';

const BaseError = require('./base.js');

class AuthenticationFailureError extends BaseError {
    constructor(message = undefined) {
        return super({
            code: 'authentication_failure',
            message: message || 'Invalid credentials',
            statusCode: 401,
        });
    }
}

module.exports = AuthenticationFailureError;
