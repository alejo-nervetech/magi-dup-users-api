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

        const userId = req.headers['x-user-id'];
        const userName = req.headers['x-user-name'];
        const userEmail = req.headers['x-user-email'];
        const organizationId = req.headers['x-organization-id'];
        const roleId = req.headers['x-user-role-id'];
        const permissionsHeader = req.headers['x-user-permissions'];

        let permissions = [];
        try {
            permissions = permissionsHeader
                ? JSON.parse(permissionsHeader)
                : [];
        } catch (_parseError) {
            permissions = [];
        }

        const user = {
            id: userId,
            name: userName,
            email: userEmail,
            organizationId: organizationId,
            roleId: roleId,
            role: {
                id: roleId,
                permissions: permissions,
            },
        };

        req.user = user;
        req.cookies = req.cookies || {};
        req.cookies.user = user;

        next();
    } catch (_error) {
        res.status(error.statusCode).send(error);
    }
};
