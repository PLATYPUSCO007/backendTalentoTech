const mongoose = require('mongoose');

const connect = ()=>{
        mongoose.connect('mongodb+srv://Ricardo:PruebaMongo2024@cluster0.77fg4.azure.mongodb.net/PracticeTech', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })   
     .then(console.log("Database connected!"))
     .catch(err => {
        console.log(err);
        // process.exit(1);
    });
}

module.exports = connect;