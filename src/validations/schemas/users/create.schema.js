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
        roleId: {
            type: 'string',
            pattern: '^role_',
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
        departmentId: {
            type: 'string',
            pattern: '^dept_',
        },
    },
    required: ['name', 'email', 'password', 'roleId'],
    additionalProperties: false,
    errorMessage: {
        required: {
            name: 'Name is required',
            email: 'Email is required',
            password: 'Password is required',
            roleId: 'Role ID is required',
        },
    },
};
