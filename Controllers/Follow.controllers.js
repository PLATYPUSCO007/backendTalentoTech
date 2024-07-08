const {FollowModel, UserModel} = require('../Models/Index.models');
const {ERROR, SUCCESS} = require('../enum/status_response.enum');
const {ValidateObjectHelper} = require('../Helpers/Index.helper');
const {FollowServices} = require('../Services/index.services');

const followTest = ["followed_user"];

const FollowController = {
    postFollow: async (req, res) => {
        try {
            let dataFollow = req.body;
            if (!ValidateObjectHelper(dataFollow, followTest))
                return res.status(400).json({
                    status: ERROR,
                    msg: "Faltan campos para registrar el follow",
                });

            if (!req.user)
                return res.status(400).json({
                    status: ERROR,
                    msg: "No estas logueado para seguir a alguien",
                });

            const idFollowing = req.user.userId;

            console.log("Following ", idFollowing);
            console.log("Followed ", dataFollow);

            if (idFollowing == dataFollow.followed_user)
                return res.status(400).json({
                    status: ERROR,
                    msg: "No puedes seguirte a ti mismo",
                });

            const existFollowedUser = await UserModel.findById(
                dataFollow.followed_user,
            )
                .select(ExcludeFieldsHelper.user)
                .exec();
            if (!existFollowedUser)
                return res.status(400).json({
                    status: ERROR,
                    msg: "No existe el usuario que quieres seguir",
                });

            const existsFollow = await FollowModel.findOne({
                following_user: idFollowing,
                followed_user: dataFollow.followed_user,
            }).exec();

            if (existsFollow)
                return res.status(400).json({
                    status: ERROR,
                    msg: "Ya sigues a esta persona",
                });

            dataFollow.following_user = idFollowing;
            console.log("Mi Follow ", dataFollow);
            const newFollow = new FollowModel(dataFollow);

            const isSavedFollow = await newFollow.save();
            if (!isSavedFollow)
                return res.status(400).json({
                    status: ERROR,
                    msg: "No se guardo el follow",
                });

            res.status(200).json({
                status: SUCCESS,
                msg: "Follow creado",
                follow: isSavedFollow,
                followeduser: existFollowedUser,
            });

            return;
        } catch (error) {
            console.error("Error al guardar el follow", error);
            return res.status(500).json({
                status: ERROR,
                error: error,
            });
        }
    },
    deletefollow: async (req, res)=>{
        try {
            if (!req.user)
                return res.status(400).json({
                    status: ERROR,
                    msg: "No estas logueado para seguir a alguien",
                });

            const { userId } = req.user;
            const { id } = req.params;

            const followDeleted = await FollowModel.findOneAndDelete({
                following_user: userId,
                followed_user: id,
            }).exec();

            if (!followDeleted)
                return res.status(400).json({
                    status: ERROR,
                    msg: "No se pudo eliminar el follow",
                });

            res.status(200).json({
                status: SUCCESS,
                msg: "unFollow ejecutado",
                deleted: followDeleted,
            });

            return;
        } catch (error) {
            console.error("Error al retirar el follow", error);
            return res.status(500).json({
                status: ERROR,
                error: error,
            });
        }
    },
    following: async (req, res) => {
        try {
            //Consultar ID de perfil personal o de otro usuario (prioridad)
            const userId = req.params.id ?? req.user.userId;
            let page = parseInt(req.params.page, 10) ?? 1;
            let itemsByPage = parseInt(req.query.limit) ?? 5;
    
            const options = {
                page,
                limit: itemsByPage,
                populate: {
                    path: 'followed_user',
                    select: excludeFieldsUser
                },
                lean: true
            }

            const follows = await FollowModel.paginate({following_user: userId}, options);
        
            if (!follows) return res.status(200).json({
                status: ERROR,
                msg: 'No hay seguidores'
            });

            const followers = await FollowServices.arrayFollowingAndFollowed(req.user.userId);

            res.status(200).json({
                status: SUCCESS,
                follows: follows.docs,
                total: follows.totalDocs,
                pages: follows.totalPages,
                page: follows.page,
                limit: follows.limit,
                usersFollowing: followers.dataFollowings,
                usersFollowers: followers.dataFollowers,
            });

            return;
        } catch (error) {
            console.error("Error al retornar los follows", error);
            return res.status(500).json({
                status: ERROR,
                error: error,
            });
        }
    },
    profile: async (req, res) => {
        try {
            if (!req.user)
                return res.status(400).json({
                    status: ERROR,
                    msg: "No estas logueado",
                });

            const { userId } = req.user;
            const { id } = req.params;
            const userProfile = await UserModel.findById(id)
                .select(ExcludeFieldsHelper.user)
                .exec();

            if (!userProfile)
                return res.status(400).json({
                    status: ERROR,
                    msg: "No se pudo encontrar el usuario",
                });

            const dataFollow = await FollowServices.dataFollowOne(userId, id);

            res.status(200).json({
                status: SUCCESS,
                msg: "Follow info",
                userProfile,
                dataFollow,
            });

            return;
        } catch (error) {
            console.error("Error al retornar los follows", error);
            return res.status(500).json({
                status: ERROR,
                error: error,
            });
        }
    },
    followers: async (req, res) => {
        try {

            //Consultar ID de perfil personal o de otro usuario (prioridad)
            const userId = req.params.id ?? req.user.userId;
            let page = parseInt(req.params.page, 10) ?? 1;
            let itemsByPage = parseInt(req.query.limit) ?? 5;

            const options = {
                page,
                limit: itemsByPage,
                populate: {
                    path: 'following_user',
                    select: excludeFieldsUser
                },
                lean: true
            }

            const follows = await FollowModel.paginate({followed_user: userId}, options);
        
            if (!follows) return res.status(200).json({
                status: ERROR,
                msg: 'No hay seguidores'
            });

            const followers = await FollowServices.arrayFollowingAndFollowed(req.user.userId);

            res.status(200).json({
                status: SUCCESS,
                follows: follows.docs,
                total: follows.totalDocs,
                pages: follows.totalPages,
                page: follows.page,
                limit: follows.limit,
                usersFollowing: followers.dataFollowings,
                usersFollowers: followers.dataFollowers,
            });

            return;

        } catch (error) {
            console.error("Error al retornar los follows", error);
            return res.status(500).json({
                status: ERROR,
                error: error,
            });
        }
    },
}

module.exports = FollowController;
