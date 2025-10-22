'use strict';

const LoginController = require('../controllers/users/login.controller');
const LoginResponseMapper = require('./../mappers/response-mappers/login-response-mapper');
const authenticate = require('./../middlewares/authenticate');
const BaseRoute = require('./base-route');
const UserValidator = require('./../validations/user.validation');

class UserRoute extends BaseRoute {
    load() {
        this.app.post('/v1/user/login', this.login);
        this.app.post('/v1/user', authenticate, this.create);
    }

    login = async (req, res, next) => {
        const { email, password } = req.body;

        try {
            UserValidator.validate('login', {
                email,
                password,
            });

            const token = await LoginController.perform(email, password);

            res.send(new LoginResponseMapper(token));
        } catch (error) {
            console.log(error);
            next(error);
        }
    };

    create = async (req, res, next) => {
        res.send('ok');
    };
}

module.exports = UserRoute;
