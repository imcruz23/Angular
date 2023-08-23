/*
Importación de módulos
*/

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Crear app de express
const app = express();

app.use(cors());


// Abrir la app en el puerto 3000

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto: ' + process.env.PORT);
});

app.get('/', (req, res) => {
    res.json({
        ok: true,
        msg: 'Servidor activo'
    });
});