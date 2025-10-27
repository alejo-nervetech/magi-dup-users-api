'use strict';

const {
    LoginController,
    CreateUserController,
    ListUsersController,
} = require('../controllers/users');
const LoginResponseMapper = require('./../mappers/response-mappers/login-response-mapper');
const UserMapper = require('./../mappers/user.mapper');
const authenticate = require('./../middlewares/authenticate');
const authorize = require('./../middlewares/authorize');
const BaseRoute = require('./base-route');
const UserValidator = require('./../validations/user.validation');

class UserRoute extends BaseRoute {
    load() {
        this.app.post('/v1/user/login', this.login);
        this.app.post(
            '/v1/user',
            authenticate,
            authorize(['system_user'], 'W'),
            this.create
        );
        this.app.get(
            '/v1/users',
            authenticate,
            authorize(['system_user'], 'R'),
            this.list
        );
    }

    login = async (req, res, next) => {
        const { email, password } = req.body;

        try {
            UserValidator.validate('login', {
                email,
                password,
            });

            const token = await LoginController.execute(email, password);

            res.send(new LoginResponseMapper(token));
        } catch (error) {
            console.log(error);
            next(error);
        }
    };

    create = async (req, res, next) => {
        try {
            UserValidator.validate('create', req.body);
            const user = await CreateUserController.execute(req.body, req.user);
            res.status(201).send(user);
        } catch (error) {
            console.log(error);
            next(error);
        }
    };

    list = async (req, res, next) => {
        try {
            const result = await ListUsersController.execute(
                req.query,
                req.user
            );
            res.send(new UserMapper(result.users, result.total));
        } catch (error) {
            console.log(error);
            next(error);
        }
    };
}

module.exports = UserRoute;
