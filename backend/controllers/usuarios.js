const Usuario = require('../models/usuarios');

const getUsuarios = async(req, res) => {
    const usuarios = await Usuario.find({});
    res.json({
        ok: true,
        msg: 'getUsuarios',
        usuarios
    });
};

module.exports = { getUsuarios };