'use strict';

const Errors = require('../../errors');
const { Roles } = require('../../../sequelize/models');
const BaseController = require('../base-controller');

class UpdateRole extends BaseController {
    static async execute(roleId, roleData, req) {
        try {
            const organizationId = req.user.organizationId;

            const role = await Roles.findOne({
                where: {
                    id: roleId,
                    organizationId: organizationId,
                },
            });

            if (!role) {
                throw new Errors.ResourceNotFoundError('role', roleId);
            }

            if (roleData.name) {
                role.name = roleData.name;
            }

            await role.save();

            return role;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UpdateRole;
