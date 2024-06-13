const {UserModel} = require('../Models/Index.models');

const userTest = {
    name: '',
    last_name: '',
    nick: '',
    email: '',
    password: '',
    role: '',
    image: '',
}

const UserController = {
    getUser: (req, res)=>{
        res.status(200).json({resp: 'Mi response data'});
    },
    createUser: async (req, res)=>{
        try {
            const newUser = new UserModel({
                name: 'Ricardo',
                last_name: 'Ricky',
                nick: 'Richard',
                email: 'ricardo@email.com',
                password: '1234',
                role: 'admin',
                image: 'image.jpg',
            });
            await newUser.save();
            res.status(200).send('Usuario creado');
        } catch (error) {
            console.error('Error al registrar el usuario', error);
            res.status(500).json({error: error})
        }
    }
}


module.exports = UserController;