const {Router} = require('express');
const router = Router();

const UserRoute = require('./User.routes');
const FollowRoute = require('./Follow.routes');

router.use('/user', UserRoute);
router.use('/follow', FollowRoute);

module.exports = router;