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

class CreateUserController extends BaseController {
    static async execute(userData, requestUser) {
        const transaction = await sequelize.transaction();

        try {
            if (!requestUser.facilityId) {
                throw new Errors.ForbiddenError(
                    'Only facility users can create users'
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

            const departmentAssignments = userData.departmentAssignments;

            if (!departmentAssignments || departmentAssignments.length === 0) {
                throw new Errors.BadRequestError(
                    'At least one department assignment is required'
                );
            }

            const roleIds = [
                ...new Set(departmentAssignments.map((a) => a.roleId)),
            ];
            const roles = await Roles.findAll({
                where: {
                    id: roleIds,
                    organizationId: requestUser.organizationId,
                },
            });

            if (roles.length !== roleIds.length) {
                const foundRoleIds = roles.map((r) => r.id);
                const missingRoleIds = roleIds.filter(
                    (id) => !foundRoleIds.includes(id)
                );
                throw new Errors.ResourceNotFoundError(
                    'Role',
                    missingRoleIds.join(', ')
                );
            }

            const departmentIds = departmentAssignments.map(
                (a) => a.departmentId
            );
            const uniqueDepartmentIds = [...new Set(departmentIds)];
            if (departmentIds.length !== uniqueDepartmentIds.length) {
                throw new Errors.BadRequestError(
                    'Duplicate department assignments are not allowed'
                );
            }

            const hashedPassword = await hashPassword(userData.password);

            const user = await Users.create(
                {
                    id: `usr_${v6().replace(/[^\w\s]/gi, '')}`,
                    name: userData.name,
                    email: userData.email,
                    password: hashedPassword,
                    organizationId: requestUser.organizationId,
                    facilityId: requestUser.facilityId,
                    userType: userData.userType || 'employee',
                    specialization: userData.specialization || null,
                    subspecialization: userData.subspecialization || null,
                    isActive: true,
                },
                { transaction }
            );

            const userDepartmentRecords = departmentAssignments.map(
                (assignment) => ({
                    id: `udept_${v6().replace(/[^\w\s]/gi, '')}`,
                    userId: user.id,
                    departmentId: assignment.departmentId,
                    roleId: assignment.roleId,
                })
            );

            await UserDepartments.bulkCreate(userDepartmentRecords, {
                transaction,
            });

            await transaction.commit();

            const createdUser = await Users.findOne({
                where: { id: user.id },
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
            });

            return createdUser;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}

module.exports = CreateUserController;
