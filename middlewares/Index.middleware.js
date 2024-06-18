const AuthMiddleware = require('./JWTValidation.middleware');
const UploadFilesMiddleware = require('./UploadFiles.middleware');

module.exports = {
    AuthMiddleware,
    UploadFilesMiddleware,
}