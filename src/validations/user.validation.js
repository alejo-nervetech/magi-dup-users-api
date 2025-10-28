'use strict';

const Errors = require('./../errors');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const addErrors = require('ajv-errors');
const BaseValidator = require('./base');
const ajv = new Ajv({ allErrors: true });

addFormats(ajv);
addErrors(ajv);

const VALID_SCHEMA = ['login', 'create', 'update'];

class UserValidator extends BaseValidator {
    static validate(schema, data) {
        if (!VALID_SCHEMA.includes(schema)) {
            throw new Errors.SchemaNotFoundError(
                `User schema ${schema}.schema cannot be found`
            );
        }

        const validationSchema = require(`./schemas/users/${schema}.schema`);

        const missingFields = [];
        const requiredFields = validationSchema.required || [];
        requiredFields.forEach((field) => {
            if (!(field in data)) {
                missingFields.push(field);
            }
        });

        if (missingFields.length > 0) {
            const errorMessages = validationSchema.errorMessage?.required || {};
            const missingFieldMessages = missingFields.map((field) => {
                return errorMessages[field] || `${field} is required`;
            });
            throw new Errors.BadRequestError(
                `missing_parameters - ${missingFieldMessages.join(', ')}`
            );
        }

        const valid = ajv.validate(validationSchema, data);

        if (!valid) {
            throw new Errors.BadRequestError(
                `malformed_payload - ${ajv.errors[0].message}`
            );
        }

        return true;
    }
}

module.exports = UserValidator;
