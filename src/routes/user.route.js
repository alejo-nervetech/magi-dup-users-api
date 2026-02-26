'use strict';

const BaseRoute = require('./base-route');
const LoginResponseMapper = require('./../mappers/response-mappers/login-response-mapper');
const UserMapper = require('./../mappers/user.mapper');
const UserValidator = require('./../validations/user.validation');
const userControllers = require('../controllers/users');
const authenticate = require('./../middlewares/authenticate');
const validateServiceToken = require('./../middlewares/validate-service-token');
const multer = require('multer');
const path = require('path');
const UploadUserController = require('../controllers/users/upload-user.controller');
const GetUsersByIdsController = require('../controllers/users/get-users-by-ids.controller');

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (_req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

class UserRoute extends BaseRoute {
    load() {
        this.app.post('/v1/user/login', validateServiceToken, this.login);
        this.app.post(
            '/v1/user/register-facility-user',
            validateServiceToken,
            this.registerFacilityUser
        );
        this.app.post('/v1/user', authenticate, this.createUser);
        this.app.get('/v1/users', authenticate, this.listUsers);
        this.app.get('/v1/user/:id', authenticate, this.getUser);
        this.app.put('/v1/user/:id', authenticate, this.updateUser);
        this.app.delete('/v1/user/:id', authenticate, this.archiveUser);
        this.app.post(
            '/v1/user/upload',
            authenticate,
            upload.single('csvFile'),
            this.uploadUsers
        );
        this.app.post(
            '/v1/users/by-ids',
            validateServiceToken,
            this.getUsersByIds
        );
    }

    async login(req, res, next) {
        const { email, password } = req.body;

        try {
            UserValidator.validate('login', {
                email,
                password,
            });

            const token = await userControllers.LoginController.execute(
                email,
                password
            );

            res.send(new LoginResponseMapper(token));
        } catch (error) {
            next(error);
        }
    }

    async createUser(req, res, next) {
        try {
            UserValidator.validate('create', req.body);
            const user = await userControllers.CreateUserController.execute(
                req.body,
                req.user
            );
            res.send(new UserMapper(user.dataValues));
        } catch (error) {
            next(error);
        }
    }

    async listUsers(req, res, next) {
        try {
            const result = await userControllers.ListUsersController.execute(
                req.query,
                req.user
            );
            res.send(new UserMapper(result.users, result.total));
        } catch (error) {
            next(error);
        }
    }

    async registerFacilityUser(req, res, next) {
        try {
            const user =
                await userControllers.RegisterFacilityUserController.execute(
                    req.body
                );
            res.send(new UserMapper(user.dataValues));
        } catch (error) {
            next(error);
        }
    }

    async uploadUsers(req, res, next) {
        try {
            const response = await UploadUserController.execute(req);
            res.send(response);
        } catch (error) {
            next(error);
        }
    }

    async getUser(req, res, next) {
        try {
            const { id } = req.params;
            const user = await userControllers.GetUserController.execute(
                id,
                req.user
            );
            res.send(new UserMapper(user));
        } catch (error) {
            next(error);
        }
    }

    async updateUser(req, res, next) {
        try {
            const { id } = req.params;
            UserValidator.validate('update', req.body);
            const user = await userControllers.UpdateUserController.execute(
                id,
                req.body,
                req.user
            );
            res.send(new UserMapper(user.dataValues));
        } catch (error) {
            next(error);
        }
    }

    async archiveUser(req, res, next) {
        try {
            const { id } = req.params;
            const user = await userControllers.ArchiveUserController.execute(
                id,
                req.user
            );
            res.send(new UserMapper(user.dataValues));
        } catch (error) {
            next(error);
        }
    }

    async getUsersByIds(req, res, next) {
        try {
            const result = await GetUsersByIdsController.execute(req.body);
            res.send(result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = UserRoute;
