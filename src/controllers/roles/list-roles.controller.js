'use strict';

const { Roles, Permissions } = require('../../../sequelize/models');
const BaseController = require('../base-controller');

class ListRoles extends BaseController {
    static async execute(req) {
        try {
            const organizationId = req.user.organizationId;

            const roles = await Roles.findAll({
                where: {
                    organizationId: organizationId,
                },
                include: [
                    {
                        model: Permissions,
                        as: 'permissions',
                        attributes: ['id', 'resource', 'accessType'],
                    },
                ],
                order: [['createdAt', 'DESC']],
            });

            return {
                roles: roles,
                total: roles.length,
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ListRoles;
