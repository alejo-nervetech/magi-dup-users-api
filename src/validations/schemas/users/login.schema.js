'use strict';

module.exports = {
    type: 'object',
    properties: {
        email: {
            type: 'string',
            format: 'email',
        },
        password: {
            type: 'string',
        },
    },
    additionalProperties: false,
    required: ['email', 'password'],
    errorMessage: {
        required: {
            email: 'Email is required',
            password: 'Password is required',
        },
    },
};
