const {Router} = require('express');
const router = Router();
const {AuthMiddleware} = require('../middlewares/Index.middleware');

const {FollowController} = require('../Controllers/Index.controller');

router.post('/create', AuthMiddleware, FollowController.postFollow);
router.post('/unfollow/:id', AuthMiddleware, FollowController.postUnfollow);
router.get('/following/:id?/:page?', FollowController.following);
router.get('/follow_data/:id', AuthMiddleware, FollowController.profile);
router.get('/test', AuthMiddleware, FollowController.followers);

module.exports = router;