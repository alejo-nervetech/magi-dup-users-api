'use strict';

const BaseController = require('../base-controller');
const Errors = require('./../../errors');
const { Users, Roles, Permissions } = require('../../../sequelize/models');
const { comparePassword } = require('../../utils/bcrypt-utils');
const { generateToken } = require('../../utils/jwt-utils');

class LoginController extends BaseController {
    static async execute(email, password) {
        try {
            const user = await Users.findOne({
                where: {
                    email: email,
                    deletedAt: null,
                },
                include: [
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

            if (!user) {
                throw new Errors.ResourceNotFoundError('user', email);
            }

            const result = await comparePassword(password, user.password);

            if (!result) {
                throw new Errors.AuthenticationFailureError();
            }

            const permissions =
                user.role?.permissions?.map((p) => ({
                    resource: p.resource,
                    accessType: p.accessType,
                })) || [];

            const sessionData = {
                id: user.id,
                name: user.name,
                email: user.email,
                organizationId: user.organizationId,
                facilityId: user.facilityId,
                departmentId: user.departmentId,
                roleId: user.roleId,
                role: user.role?.name,
                permissions: permissions,
            };

            return generateToken(sessionData);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = LoginController;
