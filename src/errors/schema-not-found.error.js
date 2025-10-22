'use strict';

const BaseError = require('./base.js');

class SchemaNotFoundError extends BaseError {
    constructor(message = undefined) {
        super({
            code: 'schema_not_found',
            message: message || 'Object schema not found',
            statusCode: 404,
        });
    }
}

module.exports = SchemaNotFoundError;
