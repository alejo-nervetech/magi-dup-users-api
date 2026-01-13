'use strict';

const Errors = require('../../errors');
const { Users, Roles } = require('../../../sequelize/models');
const BaseController = require('../base-controller');
const config = require('../../../config');
const axios = require('axios');

class GetUserController extends BaseController {
    static async execute(userId, requestUser) {
        try {
            const organizationId = requestUser.organizationId;

            const user = await Users.findOne({
                where: {
                    id: userId,
                    organizationId: organizationId,
                },
                include: [
                    {
                        model: Roles,
                        as: 'role',
                        attributes: ['id', 'name'],
                    },
                ],
                attributes: [
                    'id',
                    'name',
                    'email',
                    'userType',
                    'specialization',
                    'subspecialization',
                    'roleId',
                    'organizationId',
                    'facilityId',
                    'departmentId',
                    'isActive',
                    'createdAt',
                    'updatedAt',
                ],
            });

            if (!user) {
                throw new Errors.ResourceNotFoundError('User', userId);
            }

            const department = await GetUserController.getUserDepartment(
                user.departmentId
            );

            return { ...user.toJSON(), department };
        } catch (error) {
            throw error;
        }
    }

    static async getUserDepartment(departmentId) {
        if (!departmentId) {
            return null;
        }

        const url = `${config.services.facilityApi}/v1/departments/${departmentId}`;

        try {
            const response = await axios.get(url, {
                headers: {
                    'X-Service-Token': config.serviceSecret,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            return null;
        }
    }
}

module.exports = GetUserController;
