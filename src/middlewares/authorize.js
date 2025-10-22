'use strict';

const Errors = require('../errors');

function authorize(resources, requiredAccessType = 'R') {
    return (req, _res, next) => {
        if (!req.user || !req.user.role || !req.user.role.permissions) {
            throw new Errors.ForbiddenError(
                "The operation cannot be performed with the user's privilege"
            );
        }

        const userPermissions = req.user.role.permissions;

        const hasPermission = resources.some((resource) => {
            return userPermissions.some((permission) => {
                if (permission.resource === resource) {
                    if (requiredAccessType === 'W') {
                        return permission.accessType === 'W';
                    }
                    return (
                        permission.accessType === 'R' ||
                        permission.accessType === 'W'
                    );
                }
                return false;
            });
        });

        if (!hasPermission) {
            throw new Errors.ForbiddenError(
                'You do not have permission to perform this action'
            );
        }

        next();
    };
}

module.exports = authorize;
