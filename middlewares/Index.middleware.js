const AuthMiddleware = require('./JWTValidation.middleware');
const UploadFilesMiddleware = require('./UploadFiles.middleware');
const FolderMiddleware = require('./Folder.middleware');
const CheckEntityMiddleware = require('./CheckEntity.middleware'');

module.exports = {
    AuthMiddleware,
    UploadFilesMiddleware,
    FolderMiddleware,
    CheckEntityMiddleware,
}