'use strict';

const BaseError = require('./base.js');

class ResourceAlreadyExistsError extends BaseError {
    constructor(resource, resourceId) {
        return super({
            code: 'resource_already_exists',
            message: `The ${resource} with identifier ${resourceId} already exists`,
            statusCode: 409,
        });
    }
}

module.exports = ResourceAlreadyExistsError;
