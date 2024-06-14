const jwt = require('jwt-simple');
const moment = require('moment');

const SECRET_PASS = crypto.randomUUID();

const generateToken = (user)=>{
    const payload = {
        userId: user._id,
        role: user.role,
        name: user.name,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    }

    return jwt.encode(payload, SECRET_PASS);
}

module.exports = {
    SECRET_PASS,
    generateToken
}