'use strict';

module.exports = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
            minLength: 1,
            maxLength: 255,
        },
        email: {
            type: 'string',
            format: 'email',
            maxLength: 255,
        },
        roleId: {
            type: 'string',
            pattern: '^role_',
        },
        userType: {
            type: 'string',
            enum: ['employee', 'doctor'],
        },
        specialization: {
            type: ['string', 'null'],
            maxLength: 255,
        },
        subspecialization: {
            type: ['string', 'null'],
            maxLength: 255,
        },
        departmentId: {
            type: ['string', 'null'],
            pattern: '^dept_',
        },
        isActive: {
            type: 'boolean',
        },
    },
    required: [],
    additionalProperties: false,
    minProperties: 1,
    errorMessage: {
        minProperties: 'At least one field must be provided for update',
    },
};
