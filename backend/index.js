/*
Importación de módulos
*/

const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/configdb');
require('dotenv').config();

// Crear app de express
const app = express();
dbConnection();


app.use(cors());
app.use(express.json());

app.use('/api/usuarios', require('./routers/usuarios'));
app.use('/api/login', require('./routers/auth'));


// Abrir la app en el puerto 3000

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto: ' + process.env.PORT);
});