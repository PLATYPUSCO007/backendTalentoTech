const {Router} = require('express');
const router = Router();
const userController = require('../Controllers/User.Controller.js');
const {UserModel} = require('../Models/Index.models.js');
const {AuthMiddleware, UploadFilesMiddleware, FolderMiddleware, CheckEntityMiddleware} = require('../middlewares/Index.middleware.js');

router.post('/auth', userController.authUser);
router.get('/create', AuthMiddleware, userController.getUsers);
router.post('/create', userController.postUser);
router.get('/profile/:id', userController.getProfileById);
router.get('/list/:page?/:limit?', userController.getAllUsersPaginate);
router.put('/update', AuthMiddleware, userController.updateUser);
router.post('/uploadFile', [AuthMiddleware, CheckEntityMiddleware(UserModel, 'user_id'), FolderMiddleware.setFolder('avatars'), UploadFilesMiddleware], userController.uploadFile);
router.get('/getFile/:nameFile', userController.getFile);
router.get('/counters/:id?', AuthMiddleware, userController.counters);

module.exports = router;