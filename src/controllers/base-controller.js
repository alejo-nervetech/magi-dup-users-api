'use strict';

const Errors = require('./../errors');

class BaseController {
    static perform() {
        throw new Errors.NotImplementedError();
    }
}

module.exports = BaseController;
