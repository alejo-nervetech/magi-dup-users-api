'use strict';

const PermissionMapper = require('./permission.mapper');

class RoleMapper {
    constructor(data, total = null) {
        if (Array.isArray(data)) {
            return {
                data: data.map((role) => this.mapRole(role)),
                total: total || data.length,
            };
        }

        return this.mapRole(data);
    }

    mapRole(role) {
        const mapped = {
            id: role.id,
            name: role.name,
            organizationId: role.organizationId,
            isDefault: role.isDefault,
            canBeDeleted: role.canBeDeleted,
            createdAt: role.createdAt,
            updatedAt: role.updatedAt,
        };

        if (role.permissions) {
            mapped.permissions = role.permissions.map(
                (perm) => new PermissionMapper(perm)
            );
        }

        return mapped;
    }
}

module.exports = RoleMapper;
