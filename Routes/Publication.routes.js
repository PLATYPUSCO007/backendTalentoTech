const {Router} = require('express');
const router = Router();

const {PublicationController} = require('../Controllers/Index.controller');
const {AuthMiddleware} = require('../middlewares/Index.middleware');

router.get('/test', PublicationController.test);
router.get('/get/:id', PublicationController.getPublication);
router.post('/create', AuthMiddleware, PublicationController.postPublication);

module.exports = router;
