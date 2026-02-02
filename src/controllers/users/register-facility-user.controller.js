'use strict';

const BaseController = require('../base-controller');
const Errors = require('./../../errors');
const {
    Users,
    Roles,
    UserDepartments,
    sequelize,
} = require('../../../sequelize/models');
const { hashPassword } = require('../../utils/bcrypt-utils');
const { v6 } = require('uuid');

class RegisterFacilityUserController extends BaseController {
    static async execute(userData) {
        const transaction = await sequelize.transaction();

        try {
            if (!userData.facilityId) {
                throw new Errors.BadRequestError(
                    'facilityId is required for facility user registration'
                );
            }

            if (!userData.organizationId) {
                throw new Errors.BadRequestError('organizationId is required');
            }

            if (!userData.departmentId) {
                throw new Errors.BadRequestError(
                    'departmentId is required for facility user registration'
                );
            }

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

            const ownerRole = await Roles.findOne({
                where: {
                    name: 'Owner',
                    organizationId: userData.organizationId,
                },
            });

            if (!ownerRole) {
                throw new Errors.ResourceNotFoundError(
                    'Owner role not found for organization',
                    userData.organizationId
                );
            }

            const hashedPassword = await hashPassword(userData.password);

            const user = await Users.create(
                {
                    id: `usr_${v6().replace(/[^\w\s]/gi, '')}`,
                    name: userData.name,
                    email: userData.email,
                    password: hashedPassword,
                    organizationId: userData.organizationId,
                    facilityId: userData.facilityId,
                    userType: userData.userType || 'employee',
                    specialization: userData.specialization || null,
                    subspecialization: userData.subspecialization || null,
                    isActive: true,
                },
                { transaction }
            );

            await UserDepartments.create(
                {
                    id: `udept_${v6().replace(/[^\w\s]/gi, '')}`,
                    userId: user.id,
                    departmentId: userData.departmentId,
                    roleId: ownerRole.id,
                },
                { transaction }
            );

            await transaction.commit();

            return user;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}

module.exports = RegisterFacilityUserController;
