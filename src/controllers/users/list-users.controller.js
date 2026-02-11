'use strict';

const { Users, Roles, UserDepartments } = require('../../../sequelize/models');
const { Op } = require('sequelize');
const BaseController = require('../base-controller');
const config = require('../../../config');
const axios = require('axios');

class ListUsersController extends BaseController {
    static async execute(params = {}, user) {
        try {
            const {
                sortBy,
                sortColumn,
                pageSize,
                offsetValue,
                search,
                departmentId,
            } = params;
            const organizationId = user.organizationId;

            const where = { organizationId };

            if (user.facilityId) {
                where.facilityId = user.facilityId;
            }

            const query = {
                where,
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
                order: [
                    [
                        [
                            'id',
                            'name',
                            'email',
                            'userType',
                            'isActive',
                            'createdAt',
                            'updatedAt',
                        ].includes(sortColumn)
                            ? sortColumn
                            : 'createdAt',
                        ['ASC', 'DESC'].includes(sortBy?.toUpperCase())
                            ? sortBy.toUpperCase()
                            : 'DESC',
                    ],
                ],
            };

            if (search) {
                query.where[Op.or] = [
                    { name: { [Op.like]: `%${search}%` } },
                    { email: { [Op.like]: `%${search}%` } },
                ];
            }

            if (departmentId) {
                query.where.id = {
                    [Op.in]:
                        await ListUsersController.getUserIdsByDepartment(
                            departmentId
                        ),
                };
            }

            if (pageSize !== undefined || offsetValue !== undefined) {
                query.limit = Math.max(1, parseInt(pageSize) || 10);
                query.offset = Math.max(0, parseInt(offsetValue) || 0);
            }

            const [users, total] = await Promise.all([
                Users.findAll(query),
                Users.count({ where: query.where }),
            ]);

            const usersWithDepartments = await Promise.all(
                users.map(async (user) => {
                    const departmentAssignmentsWithDetails = await Promise.all(
                        (user.departmentAssignments || []).map(
                            async (assignment) => {
                                const department =
                                    await ListUsersController.getDepartment(
                                        assignment.departmentId
                                    );
                                return {
                                    id: assignment.id,
                                    departmentId: assignment.departmentId,
                                    department: department,
                                    roleId: assignment.roleId,
                                    role: assignment.role,
                                };
                            }
                        )
                    );

                    return {
                        ...user.toJSON(),
                        departmentAssignments: departmentAssignmentsWithDetails,
                    };
                })
            );

            return { users: usersWithDepartments, total };
        } catch (error) {
            throw error;
        }
    }

    static async getUserIdsByDepartment(departmentId) {
        const assignments = await UserDepartments.findAll({
            where: { departmentId },
            attributes: ['userId'],
        });
        return assignments.map((a) => a.userId);
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

module.exports = ListUsersController;
