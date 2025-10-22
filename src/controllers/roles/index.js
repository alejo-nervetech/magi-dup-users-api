'use strict';

const CreateRole = require('./create-role.controller');
const ListRoles = require('./list-roles.controller');
const GetRole = require('./get-role.controller');
const UpdateRole = require('./update-role.controller');
const DeleteRole = require('./delete-role.controller');
const AddPermission = require('./add-permission.controller');
const RemovePermission = require('./remove-permission.controller');

module.exports = {
    CreateRole,
    ListRoles,
    GetRole,
    UpdateRole,
    DeleteRole,
    AddPermission,
    RemovePermission,
};
