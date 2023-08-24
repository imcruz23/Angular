// Cargamos mongoose
const mongoose = require('mongoose');

// Cargar la conexion a la base de datos
const dbConnection = async() => {
        try {
            await mongoose.connect(process.env.DB_CON, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log('DB Online');
        } catch (error) {
            console.log(error);
            throw new Error('Error al iniciar la BD');
        }
    }
    // Exportar el modulo para poder ser usado
module.exports = {
    dbConnection
}