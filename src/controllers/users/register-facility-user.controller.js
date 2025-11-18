'use strict';

const BaseController = require('../base-controller');
const Errors = require('./../../errors');
const { Users, Roles } = require('../../../sequelize/models');
const { hashPassword } = require('../../utils/bcrypt-utils');
const { v6 } = require('uuid');

class RegisterFacilityUserController extends BaseController {
    static async execute(userData) {
        try {
            if (!userData.facilityId) {
                throw new Errors.BadRequestError(
                    'facilityId is required for facility user registration'
                );
            }

            if (!userData.organizationId) {
                throw new Errors.BadRequestError('organizationId is required');
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

            const user = await Users.create({
                id: `usr_${v6().replace(/[^\w\s]/gi, '')}`,
                name: userData.name,
                email: userData.email,
                password: hashedPassword,
                roleId: ownerRole.id,
                organizationId: userData.organizationId,
                facilityId: userData.facilityId,
                userType: userData.userType || 'employee',
                specialization: userData.specialization || null,
                subspecialization: userData.subspecialization || null,
                isActive: true,
            });

            return user;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = RegisterFacilityUserController;
