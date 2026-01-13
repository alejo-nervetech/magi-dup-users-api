'use strict';

const LoginController = require('./login.controller');
const CreateUserController = require('./create-user.controller');
const ListUsersController = require('./list-users.controller');
const RegisterFacilityUserController = require('./register-facility-user.controller');
const GetUserController = require('./get.controller');
const UpdateUserController = require('./update.controller');
const ArchiveUserController = require('./archive.controller');

module.exports = {
    LoginController,
    CreateUserController,
    ListUsersController,
    RegisterFacilityUserController,
    GetUserController,
    UpdateUserController,
    ArchiveUserController,
};
