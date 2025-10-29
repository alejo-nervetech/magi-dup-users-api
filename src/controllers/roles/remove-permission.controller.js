'use strict';

const Errors = require('../../errors');
const { Permissions, Roles } = require('../../../sequelize/models');
const BaseController = require('../base-controller');

class RemovePermission extends BaseController {
    static async execute(permissionId, requestUser) {
        try {
            const organizationId = requestUser.organizationId;

            const permission = await Permissions.findByPk(permissionId, {
                include: [
                    {
                        model: Roles,
                        as: 'role',
                        where: {
                            organizationId: organizationId,
                        },
                    },
                ],
            });

            if (!permission) {
                throw new Errors.ResourceNotFoundError(
                    'permission',
                    permissionId
                );
            }

            await permission.destroy();

            return permission;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = RemovePermission;
