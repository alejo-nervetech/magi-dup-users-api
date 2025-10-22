'use strict';

const AuthenticationFailureError = require('./authentication-failure.error');
const BadRequestError = require('./bad-request.error');
const FileUploadError = require('./file-upload.error');
const InternalServerError = require('./internal-server.error');
const NotImplementedError = require('./not-implemented.error');
const ResourceAlreadyExistsError = require('./resource-already-exists.error');
const ResourceNotFoundError = require('./resource-not-found.error');
const SchemaNotFoundError = require('./schema-not-found.error');

module.exports = {
    AuthenticationFailureError,
    BadRequestError,
    FileUploadError,
    InternalServerError,
    NotImplementedError,
    ResourceNotFoundError,
    ResourceAlreadyExistsError,
    SchemaNotFoundError,
};
