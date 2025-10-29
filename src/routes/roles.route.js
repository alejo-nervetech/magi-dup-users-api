'use strict';

const BaseRoute = require('./base-route');
const RoleMapper = require('../mappers/role.mapper');
const PermissionMapper = require('../mappers/permission.mapper');
const RoleValidator = require('../validations/role.validation');
const roleControllers = require('../controllers/roles');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

class RolesRoute extends BaseRoute {
    load() {
        this.app.post(
            '/v1/role',
            authenticate,
            authorize(['role'], 'W'),
            this.createRole
        );
        this.app.get('/v1/roles', authenticate, this.listRoles);
        this.app.get('/v1/role/:id', authenticate, this.getRole);
        this.app.put(
            '/v1/role/:id',
            authenticate,
            authorize(['role'], 'W'),
            this.updateRole
        );
        this.app.delete(
            '/v1/role/:id',
            authenticate,
            authorize(['role'], 'W'),
            this.deleteRole
        );

        this.app.post(
            '/v1/permission',
            authenticate,
            authorize(['role'], 'W'),
            this.addPermission
        );
        this.app.delete(
            '/v1/permission/:id',
            authenticate,
            authorize(['role'], 'W'),
            this.removePermission
        );
    }

    async createRole(req, res, next) {
        try {
            RoleValidator.validate('create', req.body);
            const role = await roleControllers.CreateRole.execute(
                req.body,
                req.user
            );
            res.send(new RoleMapper(role.dataValues));
        } catch (error) {
            next(error);
        }
    }

    async listRoles(req, res, next) {
        try {
            const result = await roleControllers.ListRoles.execute(
                req.query,
                req.user
            );
            res.send(new RoleMapper(result.roles, result.total));
        } catch (error) {
            next(error);
        }
    }

    async getRole(req, res, next) {
        try {
            const { id } = req.params;
            const role = await roleControllers.GetRole.execute(id, req.user);
            res.send(new RoleMapper(role.dataValues));
        } catch (error) {
            next(error);
        }
    }

    async updateRole(req, res, next) {
        try {
            const { id } = req.params;
            RoleValidator.validate('update', req.body);
            const role = await roleControllers.UpdateRole.execute(
                id,
                req.body,
                req.user
            );
            res.send(new RoleMapper(role.dataValues));
        } catch (error) {
            next(error);
        }
    }

    async deleteRole(req, res, next) {
        try {
            const { id } = req.params;
            const role = await roleControllers.DeleteRole.execute(id, req.user);
            res.send(new RoleMapper(role.dataValues));
        } catch (error) {
            next(error);
        }
    }

    async addPermission(req, res, next) {
        try {
            RoleValidator.validate('addPermission', req.body);
            const permission = await roleControllers.AddPermission.execute(
                req.body,
                req.user
            );
            res.send(new PermissionMapper(permission.dataValues));
        } catch (error) {
            next(error);
        }
    }

    async removePermission(req, res, next) {
        try {
            const { id } = req.params;
            const permission = await roleControllers.RemovePermission.execute(
                id,
                req.user
            );
            res.send(new PermissionMapper(permission.dataValues));
        } catch (error) {
            next(error);
        }
    }
}

module.exports = RolesRoute;
