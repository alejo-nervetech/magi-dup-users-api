'use strict';

const config = require('./../../config');
const { AuthenticationFailureError } = require('./../errors');

module.exports = async (req, res, next) => {
    const error = new AuthenticationFailureError();

    try {
        const serviceToken = req.headers['x-service-token'];

        if (!serviceToken || serviceToken !== config.serviceSecret) {
            return res.status(error.statusCode).send(error);
        }

        next();
    } catch (_error) {
        res.status(error.statusCode).send(error);
    }
};
