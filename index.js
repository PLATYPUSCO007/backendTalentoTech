// importaciones
const conecct = require('./DB/Connection');
const express = require('express');
const cors = require('cors');

// conexion BD
conecct();

// server
const app = express();
const puerto = 3900;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/t', (req, res)=>{
  res.status(200).json({
    name: 'Yo'
  })
})

app.listen(puerto, ()=>{
  console.log(`Servidor iniciado en ${puerto}`);
})
// Conf CORS

// Conf Body JSON

// Rutas

// Peticiones