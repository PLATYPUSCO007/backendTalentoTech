const {UserModel} = require('../Models/Index.models');
const {generateToken} = require('../Services/JWT.service');
const {ERROR, SUCCESS} = require('../enum/status_response.enum');
const fs = require('fs');

const userTest = [
    "name",
    "last_name",
    "nick",
    "email",
    "password",
    "role",
    "image",
    "bio",
];

const extensionsFile = ["png", "jpg", "jpeg", "gif"];

const maxFileSize = 1 * 1024 * 1024;

const validateObject = (obj, array_props)=>{
    return array_props.every(prop=>obj.hasOwnProperty(prop));
}

const UserController = {
    authUser: async (req, res)=>{
        try {
            const params = req.body;
            if(!params.email || !params.password){
                res.status(500).json({
                    status: ERROR,
                    msg: 'Faltan datos'
                });
                return;
            }
            const user = await UserModel.findOne({email: params.email}).exec();
            if (!user) {
                res.status(500).json({
                    status: ERROR,
                    msg: 'Este usuario no existe'
                });
                return;
            }
            const isMatch = await user.comparePasswords(params.password);
            if (!isMatch) {
                res.status(404).json({
                    status: ERROR,
                    msg: 'Informacion incorrecta'
                });
                return;
            }
            const token = generateToken(user);
            res.status(200).json(
                {
                    status: SUCCESS,
                    msg: `Bienvenido ${params.email}`,
                    token,
                    user: {
                        name: user.name,
                        last_name: user.last_name,
                        nick: user.nick,
                        email: user.email,
                        password: user.password,
                        role: user.role,
                        image: user.image,
                        bio: user.bio,
                        created_at: user.created_at
                    }
                }
            );
        } catch (error) {
            console.error('Error al iniciar sesion', error);
            res.status(500).json({
                status: ERROR,
                error: error
            })
        }
    },
    getUsers: async (req, res)=>{
        try {
            res.status(200).json({
                status: SUCCESS,
                msg: `Usuario logueado ${req.user.name}`
            });
        } catch (error) {
            console.error('Error al registrar el usuario', error);
            res.status(500).json({
                status: ERROR,
                error: error
            });
        }
    },
    postUser: async (req, res)=>{
        try {
            const params = req.body;
            if (!validateObject(params, userTest)) {
                res.status(400).json({
                    status: ERROR,
                    msg: 'Faltan campos para registrar el usuario'
                });
                return;
            }
            const newUser = new UserModel(params);
            const existUser = await UserModel.findOne({
                $or: [
                    {email: newUser.email},
                    {nick: newUser.nick}
                ]
            }).exec();
            if (existUser) {
                res.status(200).json({
                    status: SUCCESS,
                    msg: 'El usuario ya existe'
                });
                return;
            }
            await newUser.save();
            res.status(200).json({
                status: SUCCESS,
                msg: 'Usuario creado'
            });
        } catch (error) {
            console.error('Error al registrar el usuario', error);
            res.status(500).json({
                status: ERROR,
                error: error
            })
        }
    },
    getProfileById: async (req, res)=>{
        try {
            const {id} = req.params;
            const user = await UserModel.findById(id).select(['-password', '-__v', '-role']).exec();

            if (!user) return res.status(400).json({
                status: ERROR,
                msg: 'El usuario no existe'
            });

            res.status(200).json({
                status: SUCCESS,
                user
            });

            return;

        } catch (error) {
            console.error('Error al consultar el perfil ', error);
            return res.status(400).json({
                status: ERROR,
                msg: error
            })
        }
    },

    getAllUsersPaginate: async (req, res)=>{
        try {
            const page = parseInt(req.params.page) || 1;
            const limit = parseInt(req.params.limit) || 5;
    
            const options = {
                page,
                limit,
                select: ['-password', '-role', '-__v']
            }
    
            const users = await UserModel.paginate({}, options);

            if (!users || users.docs.length <= 0) {
                res.status(200).json({
                    status: SUCCESS,
                    msg: 'No hay usuarios disponibles'
                });
                return;
            }

            res.status(200).json({
                status: SUCCESS,
                users: users.docs,
                totalDocs: users.totalDocs,
                totalPages: users.totalPages,
                page: users.page,
                pagingCounter: users.pagingCounter,
                hasPrevPage: users.hasPrevPage,
                hasNextPage: users.hasNextPage,
                prevPage: users.prevPage,
                nextPage: users.nextPage,
                limit: users.limit,
            });

            return;
            
        } catch (error) {
            console.error('Error al consultar el perfil ', error);
            return res.status(400).json({
                status: ERROR,
                msg: error
            });
        }
    },

    updateUser: async (req, res)=>{
        try {

            const updateUser = req.body;
            const sesionUser = req.user;

            if (!validateObject(updateUser, ['email', 'nick'])) return res.status(400).json({
                    status: ERROR,
                    msg: 'Faltan datos para actualizar'
                });
            

            const users = await UserModel.find({
                $or: [
                    {email: updateUser.email},
                    {nick: updateUser.nick},
                ]
            }).exec();

            const isUserDuplicated = users.some(user=>user._id.toString() !== sesionUser.userId);

            if (isUserDuplicated) return res.status(400).json({
                status: ERROR,
                msg: 'Ya existe un usuario con este email/nick'
            });

            let userDB = await UserModel.findById(sesionUser.userId);

            if (!userDB) return res.status(400).json({
                status: ERROR,
                msg: 'Este usuario no existe'
            });

            const {iat, exp, role, image, ...userToUpdate} = updateUser;

            Object.keys(userToUpdate).forEach(key=>{
                userDB[key] = userToUpdate[key];
            });

            await userDB.save();

            delete updateUser.password;

            // const resultUser = await UserModel.findByIdAndUpdate(sesionUser.userId, userToUpdate, {new: true});
            
            // if (!resultUser) return res.status(400).json({
            //     status: ERROR,
            //     msg: 'Error al actualizar el usuario'
            // });

            res.status(200).json({
                status: SUCCESS,
                msg: 'Actualizado correctamente',
                user: updateUser
            });
            return;
        } catch (error) {
            console.error('Error al actualizar usuario ', error);
            return res.status(400).json({
                status: ERROR,
                msg: error
            });
        }
    },

    uploadFile: async (req, res)=>{
        try {
            if (!req.file) return res.status(400).json({
                status: ERROR,
                msg: 'NO hay archivo para cargar'
            });

            let image = req.file;
            const {originalname, mimetype, size, filename, path} = image;
            const {userId} = req.user;

            const isExtensionPermited = extensionsFile.some(extension=>extension.includes(mimetype.split('/')[1].toLowerCase()));
            if (!isExtensionPermited) {
                
                fs.unlinkSync(path);

                return res.status(400).json({
                    status: ERROR,
                    msg: 'Extension no permitida'
                });
            }

            if (size > maxFileSize) {
                fs.unlinkSync(path);

                return res.status(400).json({
                    status: ERROR,
                    msg: 'El tamaño excede los (5MB)'
                });
            }

            const userUpdate = await UserModel.findOneAndUpdate({_id: userId}, {image: filename}, {new: true});

            if (!userUpdate) {
                fs.unlinkSync(path);

                return res.status(400).json({
                    status: ERROR,
                    msg: 'No se actualizo el archivo'
                });
            }
            
            res.status(200).json({
                status: SUCCESS,
                file: req.file,
                user: userUpdate
            });

            return;
        } catch (error) {
            console.error('Error al actualizar usuario ', error);
            return res.status(400).json({
                status: ERROR,
                msg: error
            });
        }
    }
}


module.exports = UserController;