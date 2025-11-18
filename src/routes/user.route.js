'use strict';

const BaseRoute = require('./base-route');
const LoginResponseMapper = require('./../mappers/response-mappers/login-response-mapper');
const UserMapper = require('./../mappers/user.mapper');
const UserValidator = require('./../validations/user.validation');
const userControllers = require('../controllers/users');
const authenticate = require('./../middlewares/authenticate');
const validateServiceToken = require('./../middlewares/validate-service-token');

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
}

module.exports = UserRoute;
