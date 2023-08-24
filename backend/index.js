/*
Importación de módulos
*/

const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/configdb');
require('dotenv').config();

// Crear app de express
const app = express();

app.use(cors());
dbConnection();

app.use('/api/usuarios', require('./routers/usuarios'));

// Abrir la app en el puerto 3000

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto: ' + process.env.PORT);
});