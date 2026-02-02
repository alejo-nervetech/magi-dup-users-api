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
        password: {
            type: 'string',
            minLength: 8,
            maxLength: 255,
        },
        userType: {
            type: 'string',
            enum: ['employee', 'doctor'],
        },
        specialization: {
            type: 'string',
            maxLength: 255,
        },
        subspecialization: {
            type: 'string',
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
    },
    required: ['name', 'email', 'password', 'departmentAssignments'],
    additionalProperties: false,
    errorMessage: {
        required: {
            name: 'Name is required',
            email: 'Email is required',
            password: 'Password is required',
            departmentAssignments:
                'At least one department assignment is required',
        },
    },
};
