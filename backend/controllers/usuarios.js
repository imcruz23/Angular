const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Grupo = require('../models/grupos');
const Usuario = require('../models/usuarios');

const { response } = require('express');

const getUsuarios = async(req, res) => {
    const from = Number(req.query.from) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    // Si nos pasan en la query el id, se busca el usuario por id
    const id = req.query.id;

    try {
        let usuarios, total;
        if (id) {
            if (!validator.isMongoId(id)) {
                return res.json({
                    ok: false,
                    msg: 'Controller: El id debe ser válido'
                });
            }
            [usuarios, total] = await Promise.all([
                Usuario.findById(id).populate('grupo'),
                Usuario.countDocuments()
            ]);
        } else {
            [usuarios, total] = await Promise.all([
                Usuario.find({}).skip(from).limit(registropp).populate('grupo', '-__v'),
                Usuario.countDocuments()
            ]);
        }

        res.json({
            ok: true,
            msg: 'getUsuarios',
            usuarios,
            page: {
                from,
                registropp,
                total
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error obteniendo usuarios'
        });
    }
}

const crearUsuario = async(req, res) => {
    const { email, password, rol } = req.body;

    try {
        const exitEmail = await Usuario.findOne({ email: email });

        if (exitEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'Email ya existe'
            });
        }

        // Encriptamos la contraseña
        const salt = bcrypt.genSaltSync();
        cpassword = bcrypt.hashSync(password, salt);

        // Creamos un usuario para almacenarlo en la base de datos
        const { alta, ...object } = req.body;
        const usuario = new Usuario(object);
        // Le asignamos la contraseña encriptada
        usuario.password = cpassword;
        // guardamos en la base de datos el usuario
        await usuario.save();

        res.json({
            ok: true,
            msg: 'crearUsuario',
            usuario
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error añadiendo usuario'
        });
    }

}

const actualizarUsuario = async(req, res = response) => {
    // Asegurarnos de que aunque venga el password, no pueda cambiarlo, ya que será en otra llamada
    // Comprobar que si cambia el email, que este  no exista ya en la BD, si no existe, puede cambiarlo

    const { password, email, ...object } = req.body;
    const uid = req.params.id;

    const token = req.header('x-token');
    const decodedUserId = jwt.verify(token, process.env.JWTSECRET).uid;

    try {
        // Comprobamos si está intentando cambiar el email, que no coincida con alguno ya existente
        // Buscamos si ya existe un email igual que el que nos llega en el post
        const existeEmail = await Usuario.findOne({ email: email });
        // si hay un email igual al pasado por le body
        if (existeEmail) {
            // comprobamos si el id del model y el id pasado por parametro son distintos
            if (existeEmail._id != uid) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Email ya existe'
                });
            }
        }
        // si llegamos aquí, el email no está en uso o no está en la BD
        // pero primero comprobamos si el id es distinto, porque eso no se puede hacer
        // TODO: hacer que los admin tambien puedan hacerlo
        if (decodedUserId != id) {
            return res.status(400).json({
                ok: false,
                msg: 'Identificador no valido'
            });
        }
        object.email = email;
        const usuario = await Usuario.findByIdAndUpdate(uid, object, { new: true });
        res.json({
            ok: true,
            msg: 'Usuario actualizado'
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error actualizando usuario'
        });
    }

}

const borrarUsuario = async(req, res) => {
    const uid = req.params.id;
    // recuperamos el token
    const token = req.header('x-token');
    // buscamos el id del token para comprobar si el usuario que solicita el borrado es el mismo id que el del parametro
    const { id, rol } = jwt.verify(token, process.env.JWTSECRET);

    // comprobamos si hay token
    if (!token) {
        return res.status(400).json({
            ok: false,
            msg: 'El Token es necesario'
        });
    }
    try {
        const existeUsuario = await Usuario.findById(uid);
        if (!existeUsuario) {
            return res.status(400).json({
                ok: true,
                msg: 'Usuario no existe'
            });
        }
        if (id != uid || rol != 'ROL_ADMIN') {
            return res.status(400).json({
                ok: true,
                msg: 'No tienes permiso para realizar la accion'
            });
        }
        const resultado = await Usuario.findByIdAndRemove(uid);
        res.json({
            ok: true,
            msg: 'Usuario eliminado',
            resultado
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error borrando usuario'
        });
    }
}

module.exports = { getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario };