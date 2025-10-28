'use strict';

const Errors = require('../../errors');
const { Roles, Organizations } = require('../../../sequelize/models');
const BaseController = require('../base-controller');
const { v6 } = require('uuid');

class CreateRole extends BaseController {
    static async execute(roleData, requestUser) {
        try {
            const organizationId = requestUser.organizationId;

            const organizationExists =
                await Organizations.findByPk(organizationId);

            if (!organizationExists) {
                throw new Errors.ResourceNotFoundError(
                    'organization',
                    organizationId
                );
            }

            const existingRole = await Roles.findOne({
                where: {
                    name: roleData.name,
                    organizationId: organizationId,
                },
            });

            if (existingRole) {
                throw new Errors.ResourceAlreadyExistsError(
                    'role',
                    roleData.name
                );
            }

            const createdRole = await Roles.create({
                id: `role_${v6().replace(/[^\w\s]/gi, '')}`,
                name: roleData.name,
                organizationId: organizationId,
                isDefault: false,
                canBeDeleted: true,
            });

            return createdRole;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = CreateRole;
