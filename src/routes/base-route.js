'use strict';

const Errors = require('./../errors');

class BaseRoute {
    constructor(app) {
        this.app = app;
    }

    load() {
        throw new Errors.NotImplementedError();
    }
}

module.exports = BaseRoute;
