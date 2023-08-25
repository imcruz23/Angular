const validator = require('validator');
const bcrypt = require('bcryptjs');

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
                Usuario.find({}).skip(from).limit(registropp).populate('grupo'),
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
    try {

        // Comprobamos si está intentando cambiar el email, que no coincida con alguno ya existente
        // Buscamos si ya existe un email igual que el que nos llega en el post
        const existeEmail = await Usuario.findOne({ email: email });
        if (existeEmail) {
            // Comprobamos que el email sea el suyo, el UID debe ser igual, que esté en uso.
            if (existeEmail._id != uid) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Email ya existe'
                });
            }
            // si llegamos aquí, el email no está en uso o no está en la BD
            object.email = email;
            const usuario = await Usuario.findByIdAndUpdate(uid, object, { new: true });
            res.json({
                ok: true,
                msg: 'Usuario actualizado'
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error actualizando usuario'
        })
    }

}

const borrarUsuario = async(req, res) => {
    const uid = req.params.id;
    try {
        const existeUsuario = await Usuario.findById(uid);
        if (!existeUsuario) {
            return res.status(400).json({
                ok: true,
                msg: 'Usuario no existe'
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