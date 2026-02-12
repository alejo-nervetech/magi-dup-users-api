'use strict';

const BaseController = require('../base-controller');
const Errors = require('../../errors');
const { Organizations } = require('../../../sequelize/models');

class DeleteOrganizationController extends BaseController {
    static async execute(organizationId) {
        try {
            if (!organizationId) {
                throw new Errors.BadRequestError('Organization ID is required');
            }

            const organization = await Organizations.findByPk(organizationId);

            if (!organization) {
                throw new Errors.ResourceNotFoundError(
                    'Organization',
                    organizationId
                );
            }

            if (organization.isPlatform) {
                throw new Errors.ForbiddenError(
                    'Cannot delete platform organization'
                );
            }

            await organization.destroy();

            return { deleted: true };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = DeleteOrganizationController;
