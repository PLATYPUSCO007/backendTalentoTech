const {Router} = require('express');
const router = Router();
const userController = require('../Controllers/User.Controller.js');

router.get('/', userController.getUser);
router.get('/create', userController.createUser);

module.exports = router;