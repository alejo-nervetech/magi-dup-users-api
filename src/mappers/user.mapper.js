'use strict';

class UserMapper {
    constructor(params, total = null) {
        if (Array.isArray(params)) {
            return {
                data: params.map(
                    (user) => new UserMapper(user.dataValues || user)
                ),
                total: total || params.length,
            };
        }

        this.id = params.id;
        this.name = params.name;
        this.email = params.email;
        this.userType = params.userType;
        this.organizationId = params.organizationId;
        this.facilityId = params.facilityId;
        this.isActive = params.isActive;
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;

        if (params.userType === 'doctor') {
            this.specialization = params.specialization || null;
            this.subspecialization = params.subspecialization || null;
        }

        if (params.departmentAssignments) {
            this.departmentAssignments = params.departmentAssignments.map(
                (assignment) => ({
                    id: assignment.id,
                    departmentId: assignment.departmentId,
                    department: assignment.department,
                    roleId: assignment.roleId,
                    role: assignment.role
                        ? {
                              id: assignment.role.id,
                              name: assignment.role.name,
                          }
                        : null,
                })
            );
        }

        return this.object();
    }

    object() {
        const mapped = {
            id: this.id,
            name: this.name,
            email: this.email,
            userType: this.userType,
            organizationId: this.organizationId,
            facilityId: this.facilityId,
            isActive: this.isActive,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };

        if (this.userType === 'doctor') {
            mapped.specialization = this.specialization;
            mapped.subspecialization = this.subspecialization;
        }

        if (this.departmentAssignments) {
            mapped.departmentAssignments = this.departmentAssignments;
        }

        return mapped;
    }
}

module.exports = UserMapper;
