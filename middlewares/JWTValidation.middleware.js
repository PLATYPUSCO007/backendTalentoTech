const jwt = require('jwt-simple');
const moment = require('moment');
const {SECRET_PASS} = require('../Services/JWT.service');
const {ERROR, SUCCESS} = require('../enum/status_response.enum');

const validateJWT = (req, res, next)=>{
    if(!req.headers.authorization) return res.status(403).json({status: ERROR, msg: 'No es valido el token'});
    const token = req.headers.authorization.replace(/Bearer['"\s]+/g, '');
    try {
        let payload = jwt.decode(token, SECRET_PASS);
        if(payload.exp <= moment().unix() ){
            return res.status(403).json({
                status: ERROR, 
                msg: 'El token expiró'
            });
        }

        req.user = payload;
    } catch (error) {
        console.log('Error ', error);
        return res.status(403).json({
            status: ERROR, 
            msg: 'Error al validar el token'
        });
    }
    next();
}

module.exports = validateJWT;