'use strict';

const BaseRoute = require('./base-route');
const validateServiceToken = require('../middlewares/validate-service-token');
const CreateOrganizationController = require('../controllers/internal/create-organization.controller');
const DeleteOrganizationController = require('../controllers/internal/delete-organization.controller');

class InternalRoute extends BaseRoute {
    load() {
        this.app.post(
            '/v1/internal/organization',
            validateServiceToken,
            this.createOrganization
        );
        this.app.delete(
            '/v1/internal/organization/:id',
            validateServiceToken,
            this.deleteOrganization
        );
    }

    async createOrganization(req, res, next) {
        try {
            const result = await CreateOrganizationController.execute(req.body);
            res.status(201).send(result);
        } catch (error) {
            next(error);
        }
    }

    async deleteOrganization(req, res, next) {
        try {
            const result = await DeleteOrganizationController.execute(
                req.params.id
            );
            res.send(result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = InternalRoute;
