'use strict';

const BaseError = require('./base.js');

class BadRequestError extends BaseError {
    constructor(message = undefined) {
        return super({
            code: 'bad_request_error',
            message: message || 'Invalid payload',
            statusCode: 400,
        });
    }
}

module.exports = BadRequestError;
