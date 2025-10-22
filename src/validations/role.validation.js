'use strict';

const BaseValidator = require('./base');
const Errors = require('./../errors');

const VALID_SCHEMA = ['create', 'update', 'addPermission'];

class RoleValidator extends BaseValidator {
    static validate(schema, data) {
        if (!VALID_SCHEMA.includes(schema)) {
            throw new Errors.SchemaNotFoundError(
                `Role schema ${schema}.schema cannot be found`
            );
        }

        const _schema = require(`./schemas/roles/${schema}.schema`);

        const validator = new RoleValidator();
        const valid = validator._validate(_schema, data);

        if (!valid) {
            throw new Errors.BadRequestError(validator.errors[0].message);
        }

        return true;
    }
}

module.exports = RoleValidator;
