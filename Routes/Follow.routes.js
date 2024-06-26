const {Router} = require('express');
const router = Router();
const {AuthMiddleware} = require('../middlewares/Index.middleware');

const {FollowController} = require('../Controllers/Index.controller');

router.post('/create', AuthMiddleware, FollowController.postFollow);
router.delete('/unfollow/:id', AuthMiddleware, FollowController.deletefollow);
router.get('/following/:id?/:page?', AuthMiddleware, FollowController.following);
router.get('/follow_data/:id', AuthMiddleware, FollowController.profile);
router.get('/test', AuthMiddleware, FollowController.followers);

module.exports = router;