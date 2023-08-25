const Grupo = require('../models/grupos');
const Usuario = require('../models/usuarios');

const { response } = require('express');
const validator = require('validator');

/*
->GET /api/grupos
?from = paginar desde un elemento concreto
?id= devolver el grupo con el id concreto
*/
const getGrupos = async(req, res = response) => {
    // paginacion
    const from = req.query.from;
    const registropp = Number(process.env.DOCSPERPAGE);

    const id = req.query.id;
    await console.log("Paso por aqui");
    try {
        let grupo, total
            // si en la query se pasa el id, se le da más importancia
        if (id) {
            // se comprueba que el id sea valido
            if (!validator.isMongoId(id)) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El id no es válido'
                });
            }
            // si llega hasta aqui significa que el id es valido
            // Hacemos la promise para conseguir los usuarios
            [grupo, total] = await Promise.all([
                Grupo.findById(id),
                Grupo.countDocuments()
            ]);

        } else {
            // si llegamos aqui significa que no hay id en la query, se devuelven todos los datos
            [grupo, total] = await Promise.all([
                Grupo.find({}).skip(from).limit(registropp),
                Grupo.countDocuments()
            ]);
        }
        // devolvemos el json de los datos construidos
        res.json({
            ok: true,
            msg: 'getUsuarios',
            grupo,
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
            msg: 'error en getGrupos'
        });
    }



}

const crearGrupo = async(req, res) => {
    const nombre = String(req.body.nombre).trim();
    try {
        const existeGrupo = await Grupo.findOne({ nombre: nombre });
        if (existeGrupo) {
            return res.status(400).json({
                ok: false,
                msg: 'El grupo ya existe'
            });
        }
        const grupo = new Grupo(req.body);
        grupo.nombre = nombre;
        await grupo.save();
        res.json({
            ok: true,
            msg: 'Grupo creado'
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error en crearGrupo'
        });
    }
}

const actualizarGrupo = async(req, res) => {

    const nombre = req.body.nombre.toString().trim();
    const object = req.body;
    const uid = req.params.id;

    try {
        if (nombre) {
            const existeGrupo = await Grupo.findOne({ nombre: nombre });
            if (existeGrupo) {
                if (existeGrupo._id != uid) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'El grupo ya existe'
                    });
                }
            }
        }
        object.nombre = nombre;

        const grupo = await Grupo.findByIdAndUpdate(uid, object, { new: true });
        res.json({
            ok: true,
            msg: 'Grupo actualizado'
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al actualizar grupo'
        });
    }

}

const borrarGrupo = async(req, res) => {
    const uid = req.params.id;
    try {
        const existeGrupo = await Grupo.findById(uid);
        if (!existeGrupo) {
            return res.status(400).json({
                ok: true,
                msg: 'El grupo no existe'
            });
        }
        const resultado = await Grupo.findByIdAndRemove(uid);
        res.json({
            ok: true,
            msg: 'Grupo eliminado',
            resultado
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error eliminando grupo'
        });
    }

}

module.exports = { getGrupos, crearGrupo, actualizarGrupo, borrarGrupo };