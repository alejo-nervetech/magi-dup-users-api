'use strict';

const BaseController = require('../base-controller');
const Errors = require('../../errors');
const { Organizations } = require('../../../sequelize/models');
const { v6 } = require('uuid');
const {
    createDefaultRolesForOrganization,
} = require('../../utils/default-roles');

class CreateOrganizationController extends BaseController {
    static async execute(data) {
        try {
            if (!data.name) {
                throw new Errors.BadRequestError(
                    'Organization name is required'
                );
            }

            const organization = await Organizations.create({
                id: `org_${v6().replace(/[^\w\s]/gi, '')}`,
                name: data.name,
                isPlatform: false,
                isActive: true,
            });

            const roles = await createDefaultRolesForOrganization(
                organization.id
            );

            return {
                organization: {
                    id: organization.id,
                    name: organization.name,
                },
                roles: {
                    owner: { id: roles.owner.id, name: roles.owner.name },
                    nurse: { id: roles.nurse.id, name: roles.nurse.name },
                    doctor: { id: roles.doctor.id, name: roles.doctor.name },
                },
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = CreateOrganizationController;
