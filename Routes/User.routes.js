const {Router} = require('express');
const router = Router();
const userController = require('../Controllers/User.Controller.js');
const {AuthMiddleware} = require('../middlewares/Index.middleware.js');

router.post('/auth', userController.authUser);
router.get('/create', AuthMiddleware, userController.getUsers);
router.post('/create', userController.postUser);

module.exports = router;