const {UserModel} = require('../Models/Index.models');
const {generateToken} = require('../Services/JWT.service');
const {ERROR, SUCCESS} = require('../enum/status_response.enum');

const userTest = [
    "name",
    "last_name",
    "nick",
    "email",
    "password",
    "role",
    "image",
];

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
    }
}


module.exports = UserController;