const {Router} = require('express');
const router = Router();

const UserRoute = require('./User.routes');

router.use('/user', UserRoute)

module.exports = router;