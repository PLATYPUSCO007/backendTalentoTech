const {Router} = require('express');
const router = Router();
const userController = require('../Controllers/User.Controller.js');
const {AuthMiddleware, UploadFilesMiddleware} = require('../middlewares/Index.middleware.js');

router.post('/auth', userController.authUser);
router.get('/create', AuthMiddleware, userController.getUsers);
router.post('/create', userController.postUser);
router.get('/profile/:id', userController.getProfileById);
router.get('/list/:page?/:limit?', userController.getAllUsersPaginate);
router.put('/update', AuthMiddleware, userController.updateUser);
router.post('/uploadFile', [AuthMiddleware, UploadFilesMiddleware.single('file0')], userController.uploadFile);
router.get('/getFile/:nameFile', AuthMiddleware, userController.getFile);

module.exports = router;