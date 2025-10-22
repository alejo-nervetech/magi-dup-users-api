'use strict';

module.exports = {
    type: 'object',
    properties: {
        roleId: {
            type: 'string',
            minLength: 1,
        },
        resource: {
            type: 'string',
            minLength: 1,
        },
        accessType: {
            type: 'string',
            enum: ['R', 'W'],
        },
    },
    required: ['roleId', 'resource', 'accessType'],
    additionalProperties: false,
};
