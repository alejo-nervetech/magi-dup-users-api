'use strict';

const { Users, Roles } = require('../../../sequelize/models');
const { Op } = require('sequelize');
const BaseController = require('../base-controller');

class ListUsersController extends BaseController {
    static async execute(params = {}, user) {
        try {
            const { sortBy, sortColumn, pageSize, offsetValue, search } =
                params;
            const organizationId = user.organizationId;

            const query = {
                where: {
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

            return { users, total };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ListUsersController;
