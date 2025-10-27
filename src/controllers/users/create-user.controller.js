'use strict';

const BaseController = require('../base-controller');
const Errors = require('./../../errors');
const { Users, Roles } = require('../../../sequelize/models');
const { hashPassword } = require('../../utils/bcrypt-utils');
const { v6 } = require('uuid');

class CreateUserController extends BaseController {
    static async execute(userData, requestUser) {
        try {
            const existingUser = await Users.findOne({
                where: {
                    email: userData.email,
                },
            });

            if (existingUser) {
                throw new Errors.ResourceAlreadyExistsError(
                    'User',
                    userData.email
                );
            }

            const role = await Roles.findOne({
                where: {
                    id: userData.roleId,
                    organizationId: requestUser.organizationId,
                },
            });

            if (!role) {
                throw new Errors.ResourceNotFoundError('Role', userData.roleId);
            }

            const hashedPassword = await hashPassword(userData.password);

            const user = await Users.create({
                id: `usr_${v6().replace(/[^\w\s]/gi, '')}`,
                name: userData.name,
                email: userData.email,
                password: hashedPassword,
                roleId: userData.roleId,
                organizationId: requestUser.organizationId,
                userType: userData.userType || 'employee',
                specialization: userData.specialization || null,
                subspecialization: userData.subspecialization || null,
                isActive: true,
            });

            const userResponse = {
                id: user.id,
                name: user.name,
                email: user.email,
                userType: user.userType,
                roleId: user.roleId,
                organizationId: user.organizationId,
                isActive: user.isActive,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            };

            if (user.userType === 'doctor') {
                userResponse.specialization = user.specialization;
                userResponse.subspecialization = user.subspecialization;
            }

            return userResponse;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = CreateUserController;
