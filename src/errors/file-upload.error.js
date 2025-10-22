'use strict';

const BaseError = require('./base.js');

class FileUploadError extends BaseError {
    constructor(message = undefined) {
        return super({
            code: 'file_upload_error',
            message: message || 'An error occurred while uploading the file',
            statusCode: 400,
        });
    }
}

module.exports = FileUploadError;
