const mongoose = require('mongoose');
const { ERROR, SUCCESS } = require("../enum/status_response.enum");

const checkEntity = function(model, fieldId) {
  return (req, res, next)=>{
    try {
      let field = '';

      switch(fieldId){
        case 'id':
          field = req.params.id;
          break;
        case 'user_id':
          field = req.user.userId;
          break;
        default:
          return res.status(400).json({
            status: ERROR,
            msg: 'No se encontro el parametro'
          });
          break;
      }

      if (!mongoose.Types.ObjectId.isValid(field)) return res.status(400).json({
          status: ERROR,
          msg: 'El id no es valido'
        });

      const modelExists = await model.findById(field).exec();

      if (!modelExists) return res.status(400).json({
        status: ERROR,
        msg: 'El modelo no existe'
      });

      req.entity = modelExists;

      next();
    } catch (error) {
      console.error("Error al consultar la entidad ", error);
      return res.status(400).json({
          status: ERROR,
          msg: error,
      });
    }
  }
}

module.exports = checkEntity;