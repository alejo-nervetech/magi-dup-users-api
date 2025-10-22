'use strict';

class UserMapper {
    constructor(params) {
        this._id = params._id;
        this.email = params.email;
        this.name = params.name;
        this.organizationId = params.organizationId;
        this.password = params.password;
        this.deletedAt = params.deletedAt || null;
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;

        this.__v = params.__v;

        return this.object();
    }

    isDeleted() {
        return !!this.deletedAt;
    }

    object() {
        return {
            _id: this._id,
            email: this.email,
            name: this.name,
            organizationId: this.organizationId,
            password: this.password,
            isDeleted: this.isDeleted(),
            deletedAt: this.deletedAt,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }

    metadata() {
        return {
            __v: this.__v,
        };
    }
}

module.exports = UserMapper;
