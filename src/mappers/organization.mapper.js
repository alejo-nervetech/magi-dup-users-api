'use strict';

class OrganizationMapper {
    constructor(params, total = null) {
        if (Array.isArray(params)) {
            return {
                data: params.map(
                    (org) => new OrganizationMapper(org.dataValues || org)
                ),
                total: total || params.length,
            };
        }

        this.id = params.id;
        this.name = params.name;
        this.isActive = params.isActive;
        this.deletedAt = params.deletedAt || null;
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;

        return this.object();
    }

    object() {
        return {
            id: this.id,
            name: this.name,
            isActive: this.isActive,
            deletedAt: this.deletedAt,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}

module.exports = OrganizationMapper;
