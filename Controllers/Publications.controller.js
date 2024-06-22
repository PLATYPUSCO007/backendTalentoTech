const {PublicationModel} = require('../Models/Index.models');
const {ERROR, SUCCESS} = require('../enum/status_response.enum');
const {ValidateObjectHelper} = require('../Helpers/Index.helper');

const publicationtest = [
    "text"
]

const PublicationController = {
    test: async (req, res)=>{
        try {
            res.status(200).json({
                status: SUCCESS,
                msg: 'Funciono'
            })   
        } catch (error) {
            console.error('Error al retornar los publications', error);
            return res.status(500).json({
                status: ERROR,
                error: error
            })
        }
    },
    postPublication: async (req, res)=>{
        try {
            const publicationData = req.body;
            if (!ValidateObjectHelper(publicationData, publicationtest)) return res.status(400).json({
                status: ERROR,
                msg: 'Faltan datos para registrar la publicacion'
            });

            if (!req.user) return res.status(400).json({
                status: ERROR,
                msg: 'No estas logueado para seguir a alguien'
            });

            publicationData.user_id = req.user.userId;
            const newPublication = new PublicationModel(publicationData);
            const isStoredPublication = await newPublication.save();

            if (!isStoredPublication) return res.status(400).json({
                status: ERROR,
                msg: 'No se guardo la publicacion'
            });

            res.status(200).json({
                status: SUCCESS,
                msg: 'Se guardo la publicacion',
                publication: isStoredPublication
            })

            return;

        } catch (error) {
            console.error('Error al guardar la publication', error);
            return res.status(500).json({
                status: ERROR,
                error: error
            })
        }
    },
    getPublication: async (req, res)=>{
        try {
            const {id} = req.params;
            const publication = await PublicationModel.findById(id).populate('user_id', 'name last_name').exec();
            if (!publication) return res.status(400).json({
                status: ERROR,
                msg: 'No se pudo consultar la publicacion'
            });

            res.status(200).json({
                status: SUCCESS,
                msg: 'Se consulto la publicacion',
                publication
            })

            return;

        } catch (error) {
            console.error('Error al guardar la publication', error);
            return res.status(500).json({
                status: ERROR,
                error: error
            })
        }
    },
}

module.exports = PublicationController;