const {Router} = require('express');
const router = Router();

const UserRoute = require('./User.routes');
const FollowRoute = require('./Follow.routes');
const PublicationRoute = require('./Publication.routes');

router.use('/user', UserRoute);
router.use('/follow', FollowRoute);
router.use('/publication', PublicationRoute);

module.exports = router;