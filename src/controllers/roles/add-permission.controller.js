'use strict';

const Errors = require('../../errors');
const { Roles, Permissions } = require('../../../sequelize/models');
const BaseController = require('../base-controller');
const { v6 } = require('uuid');

class AddPermission extends BaseController {
    static async execute(permissionData, req) {
        try {
            const organizationId = req.user.organizationId;
            const { roleId, resource, accessType } = permissionData;

            const role = await Roles.findOne({
                where: {
                    id: roleId,
                    organizationId: organizationId,
                },
            });

            if (!role) {
                throw new Errors.ResourceNotFoundError('role', roleId);
            }

            const existingPermission = await Permissions.findOne({
                where: {
                    roleId: roleId,
                    resource: resource,
                    accessType: accessType,
                },
            });

            if (existingPermission) {
                throw new Errors.ResourceAlreadyExistsError(
                    'permission',
                    `${resource}:${accessType}`
                );
            }

            const createdPermission = await Permissions.create({
                id: `perm_${v6().replace(/[^\w\s]/gi, '')}`,
                roleId: roleId,
                resource: resource,
                accessType: accessType,
            });

            return createdPermission;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AddPermission;
