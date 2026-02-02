'use strict';

const Errors = require('../../errors');
const {
    Users,
    Roles,
    UserDepartments,
    sequelize,
} = require('../../../sequelize/models');
const BaseController = require('../base-controller');
const { v6 } = require('uuid');

class UpdateUserController extends BaseController {
    static async execute(userId, userData, requestUser) {
        const transaction = await sequelize.transaction();

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

            if (userData.departmentAssignments) {
                const departmentAssignments = userData.departmentAssignments;

                if (departmentAssignments.length === 0) {
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
                        organizationId: organizationId,
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

                await UserDepartments.destroy({
                    where: { userId: userId },
                    transaction,
                });

                const userDepartmentRecords = departmentAssignments.map(
                    (assignment) => ({
                        id: `udept_${v6().replace(/[^\w\s]/gi, '')}`,
                        userId: userId,
                        departmentId: assignment.departmentId,
                        roleId: assignment.roleId,
                    })
                );

                await UserDepartments.bulkCreate(userDepartmentRecords, {
                    transaction,
                });
            }

            const allowedFields = [
                'name',
                'email',
                'userType',
                'specialization',
                'subspecialization',
                'isActive',
            ];

            allowedFields.forEach((field) => {
                if (
                    userData[field] !== undefined &&
                    field !== 'departmentAssignments'
                ) {
                    user[field] = userData[field];
                }
            });

            await user.save({ transaction });

            await transaction.commit();

            const updatedUser = await Users.findOne({
                where: { id: userId },
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

            return updatedUser;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}

module.exports = UpdateUserController;
