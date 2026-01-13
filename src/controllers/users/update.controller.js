'use strict';

const Errors = require('../../errors');
const { Users, Roles } = require('../../../sequelize/models');
const BaseController = require('../base-controller');

class UpdateUserController extends BaseController {
    static async execute(userId, userData, requestUser) {
        try {
            const organizationId = requestUser.organizationId;

            const user = await Users.findOne({
                where: {
                    id: userId,
                    organizationId: organizationId,
                },
            });

            if (!user) {
                throw new Errors.ResourceNotFoundError('User', userId);
            }

            if (userData.email && userData.email !== user.email) {
                const existingUser = await Users.findOne({
                    where: { email: userData.email },
                });
                if (existingUser) {
                    throw new Errors.ResourceAlreadyExistsError(
                        'User',
                        userData.email
                    );
                }
            }

            if (userData.roleId) {
                const role = await Roles.findOne({
                    where: {
                        id: userData.roleId,
                        organizationId: organizationId,
                    },
                });
                if (!role) {
                    throw new Errors.ResourceNotFoundError(
                        'Role',
                        userData.roleId
                    );
                }
            }

            const allowedFields = [
                'name',
                'email',
                'roleId',
                'departmentId',
                'userType',
                'specialization',
                'subspecialization',
                'isActive',
            ];

            allowedFields.forEach((field) => {
                if (userData[field] !== undefined) {
                    user[field] = userData[field];
                }
            });

            await user.save();

            return user;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UpdateUserController;
