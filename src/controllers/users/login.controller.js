'use strict';

const BaseController = require('../base-controller');
const Errors = require('./../../errors');
const {
    Users,
    Roles,
    Permissions,
    UserDepartments,
} = require('../../../sequelize/models');
const { comparePassword } = require('../../utils/bcrypt-utils');
const { generateToken } = require('../../utils/jwt-utils');
const config = require('../../../config');
const axios = require('axios');

class LoginController extends BaseController {
    static async execute(email, password) {
        try {
            const user = await Users.findOne({
                where: {
                    email: email,
                    deletedAt: null,
                },
                include: [
                    {
                        model: UserDepartments,
                        as: 'departmentAssignments',
                        include: [
                            {
                                model: Roles,
                                as: 'role',
                                include: [
                                    {
                                        model: Permissions,
                                        as: 'permissions',
                                    },
                                ],
                            },
                        ],
                    },
                ],
            });

            if (!user) {
                throw new Errors.ResourceNotFoundError('user', email);
            }

            const result = await comparePassword(password, user.password);

            if (!result) {
                throw new Errors.AuthenticationFailureError();
            }

            let departmentAssignments;

            if (
                !user.departmentAssignments ||
                user.departmentAssignments.length === 0
            ) {
                const orgRole = await Roles.findOne({
                    where: { organizationId: user.organizationId },
                    include: [{ model: Permissions, as: 'permissions' }],
                });

                departmentAssignments = orgRole
                    ? [
                          {
                              departmentId: null,
                              departmentName: null,
                              roleId: orgRole.id,
                              roleName: orgRole.name,
                              permissions:
                                  orgRole.permissions?.map((p) => ({
                                      resource: p.resource,
                                      accessType: p.accessType,
                                  })) || [],
                          },
                      ]
                    : [];
            } else {
                departmentAssignments = await Promise.all(
                    user.departmentAssignments.map(async (assignment) => {
                        const permissions =
                            assignment.role?.permissions?.map((p) => ({
                                resource: p.resource,
                                accessType: p.accessType,
                            })) || [];

                        const departmentName =
                            await LoginController.getDepartmentName(
                                assignment.departmentId
                            );

                        return {
                            departmentId: assignment.departmentId,
                            departmentName: departmentName,
                            roleId: assignment.roleId,
                            roleName: assignment.role?.name,
                            permissions: permissions,
                        };
                    })
                );
            }

            const sessionData = {
                id: user.id,
                name: user.name,
                email: user.email,
                organizationId: user.organizationId,
                facilityId: user.facilityId,
                departmentAssignments: departmentAssignments,
            };

            return generateToken(sessionData);
        } catch (error) {
            throw error;
        }
    }

    static async getDepartmentName(departmentId) {
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
            return response.data || departmentId;
        } catch (error) {
            return departmentId;
        }
    }
}

module.exports = LoginController;
