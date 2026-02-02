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
        departmentAssignments: {
            type: 'array',
            minItems: 1,
            items: {
                type: 'object',
                properties: {
                    departmentId: {
                        type: 'string',
                        pattern: '^dept_',
                    },
                    roleId: {
                        type: 'string',
                        pattern: '^role_',
                    },
                },
                required: ['departmentId', 'roleId'],
                additionalProperties: false,
            },
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
