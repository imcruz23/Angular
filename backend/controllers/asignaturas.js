const { response } = require('express');
const Usuario = require('../models/usuarios');
const Asignatura = require('../models/asignaturas');
const validator = require('validator');

const getAsignaturas = async(req, res = response) => {
    // Recogemos los parametros de la query
    const from = Number(req.params.from) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);

    const uid = req.params.id;

    try {
        let asignaturas, total;
        // Se le da prioridad al id por encima del from
        if (uid) {
            [asignaturas, total] = await Promise.all([
                Asignatura.findById(uid).populate('curso').populate('profesores.usuario', '-password -alta -__v'),
                Asignatura.countDocuments()
            ]);
        } else {
            [asignaturas, total] = await Promise.all([
                Asignatura.find({}).skip(from).limit(registropp).populate('curso').populate('profesores.usuario', '-password -alta -__v'),
                Asignatura.countDocuments()
            ]);
        }
        res.json({
            ok: true,
            msg: 'getAsignaturas',
            asignaturas,
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
            msg: 'Error en getAsignaturas'
        });
    }
}

const crearAsignatura = async(req, res = response) => {
    res.json({
        ok: true,
        msg: 'crearAsignatura'
    });
}

const actualizarAsignatura = async(req, res = response) => {
    res.json({
        ok: true,
        msg: 'actualizarAsignatura'
    });
}

const borrarAsignatura = async(req, res = response) => {
    const uid = req.params.id;
    const { id, rol } = req.header('x-token');

    try {
        // Primero se comprueba que los roles sean los adecuados
        if (rol != 'ROL_PROFESOR' || rol != 'ROL_ADMING') {
            return res.status(400).json({
                ok: false,
                msg: 'Permisos insuficientes'
            });
        }
        // Comprobamos que el identificador es válido
        if (!validator.isMongoId(uid)) {
            return res.status(400).json({
                ok: false,
                msg: 'Identificador no válido'
            });
        }

        // Comprobamos si existe la asignatura en la BBDD
        const existeAsignatura = await Asignatura.findById(uid);

        if (!existeAsignatura) {
            return res.status(400).json({
                ok: false,
                msg: 'Asignatura no existe'
            });
        }

        // Eliminamos la asignatura de la BBDD
        const resultado = await Asignatura.findByIdAndRemove(uid);
        res.json({
            ok: true,
            msg: 'Asignatura borrada correctamente',
            resultado
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error en borrarAsignaturas'
        });

    }
}

module.exports = { getAsignaturas, crearAsignatura, actualizarAsignatura, borrarAsignatura };