'use strict';

const BaseValidator = require('./base');
const Errors = require('./../errors');

const VALID_SCHEMA = ['login', 'create', 'update'];

class UserValidator extends BaseValidator {
    static validate(schema, data) {
        if (!VALID_SCHEMA.includes(schema)) {
            throw new Errors.SchemaNotFoundError(
                `User schema ${schema}.schema cannot be found`
            );
        }

        const _schema = require(`./schemas/users/${schema}.schema`);

        const validator = new UserValidator();
        const valid = validator._validate(_schema, data);

        if (!valid) {
            throw new Errors.BadRequestError(validator.errors[0].message);
        }

        return true;
    }
}

module.exports = UserValidator;
