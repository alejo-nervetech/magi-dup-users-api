'use strict';

class PermissionMapper {
    constructor(data) {
        return this.mapPermission(data);
    }

    mapPermission(permission) {
        return {
            id: permission.id,
            roleId: permission.roleId,
            resource: permission.resource,
            accessType: permission.accessType,
            createdAt: permission.createdAt,
            updatedAt: permission.updatedAt,
        };
    }
}

module.exports = PermissionMapper;
