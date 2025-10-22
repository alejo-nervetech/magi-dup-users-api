'use strict';

const Ajv = require('ajv');

const addFormats = require('ajv-formats');

const ajv = new Ajv();
addFormats(ajv);

class BaseValidator {
    _validate(schema, data) {
        const valid = ajv.validate(schema, data);

        if (!valid) {
            this.errors = ajv.errors;
            return false;
        }

        return true;
    }

    errors() {
        return this.errors;
    }
}

module.exports = BaseValidator;
