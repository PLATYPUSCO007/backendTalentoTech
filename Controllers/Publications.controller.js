const { PublicationModel } = require("../Models/Index.models");
const { ERROR, SUCCESS } = require("../enum/status_response.enum");
const { ValidateObjectHelper, ValidateExtensionHelper, ExcludeFieldsHelper } = require("../Helpers/Index.helper");
const { FollowServices } = require("../Services/index.services");
const fs = require("fs");
const path = require("path");

const publicationtest = ["text"];
const maxFileSize = 1 * 1024 * 1024;

const PublicationController = {
    test: async (req, res) => {
        try {
            res.status(200).json({
                status: SUCCESS,
                msg: "Funciono",
            });
        } catch (error) {
            console.error("Error al retornar los publications", error);
            return res.status(500).json({
                status: ERROR,
                error: error,
            });
        }
    },
    postPublication: async (req, res) => {
        try {
            const publicationData = req.body;
            if (!ValidateObjectHelper(publicationData, publicationtest))
                return res.status(400).json({
                    status: ERROR,
                    msg: "Faltan datos para registrar la publicacion",
                });

            if (!req.user)
                return res.status(400).json({
                    status: ERROR,
                    msg: "No estas logueado para seguir a alguien",
                });

            publicationData.user_id = req.user.userId;
            const newPublication = new PublicationModel(publicationData);
            const isStoredPublication = await newPublication.save();

            if (!isStoredPublication)
                return res.status(400).json({
                    status: ERROR,
                    msg: "No se guardo la publicacion",
                });

            res.status(200).json({
                status: SUCCESS,
                msg: "Se guardo la publicacion",
                publication: isStoredPublication,
            });

            return;
        } catch (error) {
            console.error("Error al guardar la publication", error);
            return res.status(500).json({
                status: ERROR,
                error: error,
            });
        }
    },
    getPublication: async (req, res) => {
        try {
            const { id } = req.params;
            const publication = await PublicationModel.findById(id)
                .populate("user_id", "name last_name")
                .exec();
            if (!publication)
                return res.status(400).json({
                    status: ERROR,
                    msg: "No se pudo consultar la publicacion",
                });

            res.status(200).json({
                status: SUCCESS,
                msg: "Se consulto la publicacion",
                publication,
            });

            return;
        } catch (error) {
            console.error("Error al guardar la publication", error);
            return res.status(500).json({
                status: ERROR,
                error: error,
            });
        }
    },
    deletePublication: async (req, res) => {
        try {
            if (!req.user) return res.status(400).json({
                status: ERROR,
                msg: "No estas logueado",
            });
                
            const { id } = req.params;
            
            const publication = await PublicationModel.findByIdAndDelete({
                user_id: req.user.userId,
                _id: id,
            }).populate("user_id", "name last_name");
            
            if (!publication) return res.status(400).json({
                status: ERROR,
                msg: "No se pudo consultar la publicacion",
            });

            res.status(200).json({
                status: SUCCESS,
                msg: "Se elimino la publicacion",
                publication,
            });
        } catch (error) {
            console.error("Error al eliminar la publication", error);
            return res.status(500).json({
                status: ERROR,
                error: error,
            });
        }
    },
    getPublications: async (req, res) =>{
        try{
            const {id} = req.params;
            const page = parseInt(req.params.page) ?? 1;
            const itemsByPage = parseInt(req.query.limit) ?? 10;

            const options = {
                page,
                limit: itemsByPage,
                sort: {
                    created_at: -1,
                },
                populate: {
                    path: "user_id",
                    select: ExcludeFieldsHelper.user,
                },
                lean: true
            }
            
            const publications = await PublicationModel.paginate({user_id: id}, options);

            if(!publications.docs || publications.docs.length === 0) return res.status(400).json({
                status: ERROR,
                msg: "No se pudo consultar la publicacion",
            });

            res.status(200).json({
                status: SUCCESS,
                msg: "Se consulto la publicacion",
                total: publications.totalDocs,
                pages: publications.totalPages,
                page: publications.page,
                limit: publications.limit,
                publications: publications.docs,
            });

            return;
            
        }catch(error){
            console.error("Error al eliminar la publication", error);
            return res.status(500).json({
                status: ERROR,
                error: error,
            });
        }
    },
    uploadMedia: async (req, res) =>{
        try{
            if(!req.file) return res.status(400).json({
                status: ERROR,
                msg: "No hay archivos para cargar",
            });

            let image = req.file;
            const {originalname, mimetype, size, filename, path} = image;
            const {userId} = req.user;
            const {id} = req.params;

            if(!ValidateExtensionHelper(mimetype.split("/")[1].toLowerCase())){
                fs.unlinkSync(path);

                return res.status(400).json({
                    status: ERROR,
                    msg: "Extension no permitida",
                });
            }

            if (size > maxFileSize) {
                fs.unlinkSync(path);

                return res.status(400).json({
                    status: ERROR,
                    msg: "El tamaño excede los (5MB)",
                });
            }

            const pathFileExist = path.resolve(`./uploads/publications/`, filename);
            try {
                fs.statSync(pathFileExist);
            } catch (error) {
                return res.status(400).json({
                    status: ERROR,
                    msg: "Error al verificar el archivo",
                });
            }

            const publicationUpdated = await PublicationModel.findOneAndUpdate({
                user_id: userId,
                _id: id,
            },{
                file: filename,
            },{
                new: true
            });

            if (!publicationUpdated) {
                fs.unlinkSync(path);

                return res.status(400).json({
                    status: ERROR,
                    msg: "No se actualizo el archivo",
                });
            }

            res.status(200).json({
                status: SUCCESS,
                file: req.file,
                publication: publicationUpdated,
            });

            return;
            
        }catch(error){
            console.error("Error subir el contenido multimedia", error);
            return res.status(500).json({
                status: ERROR,
                error: error,
            });
        }
    },
    getMedia: async (req, res)=>{
        try {
            const {id} = req.params;
            const filePath = `./uploads/publications/${id}`;
            fs.stat(filePath, (error, exists)=>{
                if (!exists) return res.status(400).json({
                    status: ERROR,
                    msg: "No se encontro el archivo",
                });
            })

            return res.status(200).sendFile(path.resolve(filePath));
            
        } catch (error) {
            console.error("Error al devolver contenido multimedia", error);
            return res.status(500).json({
                status: ERROR,
                error: error,
            });
        }
    },
    feed: async (req, res)=>{
        try {
            const page = parseInt(req.params.page) ?? 1;
            const itemsByPage = parseInt(req.query.limit) ?? 10;

            if (!req.user) return res.status(400).json({
                status: ERROR,
                msg: "No has iniciado sesion",
            });

            const myFollows = await FollowServices.arrayFollowingAndFollowed(req.user.userId);

            if (!myFollows.dataFollowings || myFollows.dataFollowings.length === 0) return res.status(400).json({
                status: ERROR,
                msg: "No tienes seguidos",
            });

            const options = {
                page,
                limit: itemsByPage,
                sort: {
                    created_at: -1,
                },
                populate: {
                    path: "user_id",
                    select: ExcludeFieldsHelper.user,
                },
                lean: true
            }

            const publications = await PublicationModel.paginate({
                user_id: {$in: myFollows.dataFollowings}
            }, options);

            if (!publications.docs || publications.docs.length === 0) return res.status(400).json({
                status: ERROR,
                msg: "No hay publicaciones de los que sigues",
            });

            res.status(200).json({
                status: SUCCESS,
                msg: "Se consulto las publicaciones",
                total: publications.totalDocs,
                pages: publications.totalPages,
                page: publications.page,
                limit: publications.limit,
                publications: publications.docs,
            });
            
            return;
            
        } catch (error) {
            console.error("Error al devolver la publicacion de los seguidores", error);
            return res.status(500).json({
                status: ERROR,
                error: error,
            });
        }
    },
};

module.exports = PublicationController;
