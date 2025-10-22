'use strict';

const BaseRoute = require('./base-route');

class SampleRoute extends BaseRoute {
    load() {
        this.app.get('/sample', this.respond);
    }

    respond = (_req, res) => {
        res.send('This route works!');
    };
}

module.exports = SampleRoute;
