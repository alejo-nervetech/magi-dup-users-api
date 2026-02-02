'use strict';

const Errors = require('../../errors');
const { Users, Roles, UserDepartments } = require('../../../sequelize/models');
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
                        model: UserDepartments,
                        as: 'departmentAssignments',
                        include: [
                            {
                                model: Roles,
                                as: 'role',
                                attributes: ['id', 'name'],
                            },
                        ],
                    },
                ],
                attributes: [
                    'id',
                    'name',
                    'email',
                    'userType',
                    'specialization',
                    'subspecialization',
                    'organizationId',
                    'facilityId',
                    'isActive',
                    'createdAt',
                    'updatedAt',
                ],
            });

            if (!user) {
                throw new Errors.ResourceNotFoundError('User', userId);
            }

            const departmentAssignmentsWithDetails = await Promise.all(
                (user.departmentAssignments || []).map(async (assignment) => {
                    const department = await GetUserController.getDepartment(
                        assignment.departmentId
                    );
                    return {
                        id: assignment.id,
                        departmentId: assignment.departmentId,
                        department: department,
                        roleId: assignment.roleId,
                        role: assignment.role,
                    };
                })
            );

            return {
                ...user.toJSON(),
                departmentAssignments: departmentAssignmentsWithDetails,
            };
        } catch (error) {
            throw error;
        }
    }

    static async getDepartment(departmentId) {
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
