'use strict';

const {
    Users,
    Organizations,
    Roles,
    Permissions,
} = require('../../sequelize/models');
const config = require('./../../config');
const { AuthenticationFailureError } = require('./../errors');

const jwt = require('jsonwebtoken');

async function retrieveTokenOwner(authorization) {
    const decodedAuthorization = jwt.verify(
        authorization,
        config.encryption.jwt.jwtToken
    );

    return await findUser(decodedAuthorization.id);
}

async function findUser(userId) {
    try {
        const user = await Users.findByPk(userId, {
            include: [
                {
                    model: Organizations,
                    as: 'organization',
                },
                {
                    model: Roles,
                    as: 'role',
                    include: [
                        {
                            model: Permissions,
                            as: 'permissions',
                        },
                    ],
                },
            ],
        });

        if (!user || user.deletedAt) {
            return null;
        }

        return user;
    } catch (_error) {
        return null;
    }
}

module.exports = async (req, res, next) => {
    const error = new AuthenticationFailureError();

    try {
        const authorization = req.headers.authorization.split(' ')[1];

        const user = await retrieveTokenOwner(authorization);

        if (user) {
            req.user = user.dataValues;
            req.cookies.user = user.dataValues;

            next();
        } else {
            res.status(error.statusCode);
            res.send(error);
        }
    } catch (_error) {
        res.status(error.statusCode);
        res.send(error);
    }
};
