const mongoose = require('mongoose');

const connect = async ()=>{
    try {
        await mongoose.connect('mongodb+srv://Ricardo:6fJztoQygU4VvmJk@cluster0.77fg4.azure.mongodb.net/Colegio10?retryWrites=true&w=majority&appName=Cluster0');
        console.log('BD conectada');
    } catch (error) {
        console.error('Error al conectar la BD');
        throw new error('Error al conectar la BD');
    }
}

module.exports = connect;