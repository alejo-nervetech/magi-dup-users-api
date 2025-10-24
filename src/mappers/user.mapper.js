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
        this.roleId = params.roleId;
        this.organizationId = params.organizationId;
        this.isActive = params.isActive;
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;

        if (params.userType === 'doctor') {
            this.specialization = params.specialization || null;
            this.subspecialization = params.subspecialization || null;
        }

        if (params.role) {
            this.role = {
                id: params.role.id,
                name: params.role.name,
            };
        }

        return this.object();
    }

    object() {
        const mapped = {
            id: this.id,
            name: this.name,
            email: this.email,
            userType: this.userType,
            roleId: this.roleId,
            organizationId: this.organizationId,
            isActive: this.isActive,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };

        if (this.userType === 'doctor') {
            mapped.specialization = this.specialization;
            mapped.subspecialization = this.subspecialization;
        }

        if (this.role) {
            mapped.role = this.role;
        }

        return mapped;
    }
}

module.exports = UserMapper;
