const Usuario = require('../models/usuarios');
const { validationResult } = require('express-validator');

const getUsuarios = async(req, res) => {
    const usuarios = await Usuario.find({});
    res.json({
        ok: true,
        msg: 'getUsuarios',
        usuarios
    });
}

const crearUsuario = async(req, res) => {
    const { email, password } = req.body;

    const exitEmail = await Usuario.findOne({ email: email });

    if (exitEmail) {
        return res.status(400).json({
            ok: false,
            msg: 'Email ya existe'
        });
    }

    res.json({
        ok: true,
        msg: 'crearUsuario',
    });
}

const actualizarUsuario = async(req, res) => {
    res.json({
        ok: true,
        msg: 'actualizarUsuario'
    });
}

const borrarUsuario = async(req, res) => {
    res.json({
        ok: true,
        msg: 'borrarUsuario'
    })
}

module.exports = { getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario };