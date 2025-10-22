'use strict';

const BaseError = require('./base.js');

class InternalServerError extends BaseError {
    constructor(message = undefined) {
        return super({
            message:
                message ||
                "Something went wrong on our end. Rest assured we're working on it",
        });
    }
}

module.exports = InternalServerError;
