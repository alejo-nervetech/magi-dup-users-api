'use strict';

const BaseError = require('./base.js');

class NotImplementedError extends BaseError {
    constructor(message = undefined) {
        return super({
            code: 'not_implemented_error',
            message: message || 'Not implemented error',
            statusCode: 500,
        });
    }
}

module.exports = NotImplementedError;
