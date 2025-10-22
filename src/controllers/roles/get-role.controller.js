'use strict';

const Errors = require('../../errors');
const { Roles, Permissions } = require('../../../sequelize/models');
const BaseController = require('../base-controller');

class GetRole extends BaseController {
    static async execute(roleId, req) {
        try {
            const organizationId = req.user.organizationId;

            const role = await Roles.findOne({
                where: {
                    id: roleId,
                    organizationId: organizationId,
                },
                include: [
                    {
                        model: Permissions,
                        as: 'permissions',
                        attributes: ['id', 'resource', 'accessType'],
                    },
                ],
            });

            if (!role) {
                throw new Errors.ResourceNotFoundError('role', roleId);
            }

            return role;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = GetRole;
