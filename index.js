// importaciones
const connect = require('./DB/Connection');
const express = require('express');
const cors = require('cors');

const apiRoutes = require('./Routes/Index.routes');

// server
const app = express();
const puerto = 3900;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

// conexion BD
connect();

app.use('/api', apiRoutes);

app.listen(puerto, ()=>{
  console.log(`Servidor iniciado en ${puerto}`);
})
// Conf CORS

// Conf Body JSON

// Rutas

// Peticiones