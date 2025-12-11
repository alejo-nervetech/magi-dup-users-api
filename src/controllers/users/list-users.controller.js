'use strict';

const { Users, Roles } = require('../../../sequelize/models');
const { Op } = require('sequelize');
const BaseController = require('../base-controller');
const config = require('../../../config');
const axios = require('axios');

class ListUsersController extends BaseController {
    static async execute(params = {}, user) {
        try {
            const { sortBy, sortColumn, pageSize, offsetValue, search } =
                params;
            const organizationId = user.organizationId;

            const query = {
                where: { organizationId },
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
                order: [
                    [
                        [
                            'id',
                            'name',
                            'email',
                            'userType',
                            'roleId',
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
                    const department =
                        await ListUsersController.getUserDepartment(
                            user.departmentId
                        );
                    return { ...user.toJSON(), department };
                })
            );

            console.log(usersWithDepartments);

            return { users: usersWithDepartments, total };
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
            throw error;
        }
    }
}

module.exports = ListUsersController;
