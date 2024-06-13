const mongoose = require('mongoose');

const connect = ()=>{
        mongoose.connect('mongodb+srv://Ricardo:FduAHrNkzPiS8Awf@cluster0.77fg4.azure.mongodb.net/PracticeTech?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000
        })   
     .then(() => console.log("Database connected!"))
     .catch(err => console.log(err));
}

module.exports = connect;