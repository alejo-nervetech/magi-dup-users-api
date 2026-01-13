'use strict';

const Errors = require('../../errors');
const { Users } = require('../../../sequelize/models');
const BaseController = require('../base-controller');

class ArchiveUserController extends BaseController {
    static async execute(userId, requestUser) {
        try {
            const organizationId = requestUser.organizationId;

            if (userId === requestUser.userId) {
                throw new Errors.BadRequestError(
                    'Cannot archive your own account'
                );
            }

            const user = await Users.findOne({
                where: {
                    id: userId,
                    organizationId: organizationId,
                },
            });

            if (!user) {
                throw new Errors.ResourceNotFoundError('User', userId);
            }

            await user.destroy();

            return user;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ArchiveUserController;
