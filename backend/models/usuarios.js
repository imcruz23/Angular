const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        require: true
    },
    apellidos: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    imagen: {
        type: String
    },
    rol: {
        type: String,
        require: true,
        default: 'ROL_ALUMNO'
    }
}, { collection: 'usuarios' });

module.exports = model('Usuario', UsuarioSchema);