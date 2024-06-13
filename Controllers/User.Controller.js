const {UserModel} = require('../Models/Index.models');

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
    getUser: (req, res)=>{
        res.status(200).json({resp: 'Mi response data'});
    },
    createUser: async (req, res)=>{
        try {
            
            res.status(200).send('Usuario creado');
        } catch (error) {
            console.error('Error al registrar el usuario', error);
            res.status(500).json({error: error})
        }
    },
    postUser: async (req, res)=>{
        try {
            const params = req.body;
            if (!validateObject(params, userTest)) {
                res.status(400).send('Faltan campos para registrar el usuario');
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
                res.status(200).send('El usuario ya existe');
                return;
            }
            await newUser.save();
            res.status(200).send('Usuario creado');
        } catch (error) {
            console.error('Error al registrar el usuario', error);
            res.status(500).json({error: error})
        }
    }
}


module.exports = UserController;