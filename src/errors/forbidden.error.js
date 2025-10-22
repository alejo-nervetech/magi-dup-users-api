'use strict';

const BaseError = require('./base');

class ForbiddenError extends BaseError {
    constructor(message) {
        super({
            code: 'forbidden',
            message: message || 'Access forbidden',
            statusCode: 403,
        });
    }
}

module.exports = ForbiddenError;
