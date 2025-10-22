'use strict';

const BaseError = require('./base.js');

class ResourceNotFoundError extends BaseError {
    constructor(resource, resourceId) {
        return super({
            code: 'resource_not_found',
            message: 'The selected resource cannot be found',
            statusCode: 404,
        });
    }
}

module.exports = ResourceNotFoundError;
