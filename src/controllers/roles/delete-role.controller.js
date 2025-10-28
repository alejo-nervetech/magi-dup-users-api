'use strict';

const Errors = require('../../errors');
const { Roles } = require('../../../sequelize/models');
const BaseController = require('../base-controller');

class DeleteRole extends BaseController {
    static async execute(roleId, requestUser) {
        try {
            const organizationId = requestUser.organizationId;

            const role = await Roles.findOne({
                where: {
                    id: roleId,
                    organizationId: organizationId,
                },
            });

            if (!role) {
                throw new Errors.ResourceNotFoundError('role', roleId);
            }

            if (!role.canBeDeleted) {
                throw new Errors.BadRequestError(
                    'This role cannot be deleted. Default roles are protected.'
                );
            }

            await role.destroy();

            return role;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = DeleteRole;
