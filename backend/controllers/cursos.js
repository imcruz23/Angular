const { response } = require('express');
const validator = require('validator');
const Curso = require('../models/cursos');

// GET
const getCursos = async(req, res = response) => {
    // recogemos el parametro from (si existe)
    const from = Number(req.query.from) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);

    // verificamos si hay parametro id
    const id = req.query.id;

    try {
        let cursos, total;
        if (id) {
            if (!validator.isMongoId(id)) {
                return res.status(400).json({
                    ok: false,
                    msg: 'identificador no valido'
                });
            }
            [cursos, total] = await Promise.all([
                Curso.findById(id),
                Curso.countDocuments()
            ]);
        }
        [cursos, total] = await Promise.all([
            Curso.find({}).skip(from).limit(registropp),
            Curso.countDocuments()
        ]);
        res.json({
            ok: true,
            msg: 'getCursos',
            cursos,
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
            msg: 'Error en getCursos'
        });
    }
}

//POST -> Crea un curso
/*
    Datos obligatorios del body:
    Nombre: Nombre del curso
    Nombrecorto: Nombre abreviado del curso
    Activo: por defecto true
*/
const crearCurso = async(req, res = response) => {

    // TODO: Hacer que solo el admin pueda hacer estas cosas

    const { nombre, nombrecorto } = req.body;

    // Comprobamos si el curso existe buscando en la base de datos si el nombre ya está usado
    try {

        const existeNombre = await Curso.findOne({ nombre });

        if (existeNombre) {
            return res.status(400).json({
                ok: false,
                msg: 'El curso ya existe'
            });
        }

        const existeNombreCorto = await Curso.findOne({ nombrecorto });

        if (existeNombreCorto) {
            return res.status(400).json({
                ok: false,
                msg: 'Nombre corto ya en uso'
            });
        }

        const curso = new Curso();
        curso.nombre = nombre;
        curso.nombrecorto = nombrecorto;

        await curso.save()

        res.json({
            ok: true,
            msg: 'Curso creado correctamente',
            curso
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error en crearCurso'
        });
    }
}


//PUT -> Modifica el curso dado por parametro ID

/*
    PARAMETROS:
        id-> el identificador del curso
    DATOS BODY:
    ->Nombre
    ->NombreCorto
*/
const actualizarCurso = async(req, res = response) => {

    const uid = req.params.id;
    const { nombre, nombrecorto } = req.body;
    const object = req.body;

    try {
        if (!uid) {
            return res.status(400).json({
                ok: false,
                msg: 'Faltan parametros'
            });
        }
        // TODO: Comprobar que solo admins o profesores puedan cambiar esto

        const cursoIsSame = await Curso.findOne({ nombre });

        // vemos si el curso ya existe
        if (cursoIsSame) {
            // Comprobamos si el id que se quiere modificar es el mismo que el otro curso
            if (uid != cursoIsSame._id || nombreCorto != cursoIsSame.nombreCorto) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Curso ya existe o tiene el mismo nombre'
                });
            }
        }
        const cursoUpdate = await Curso.findByIdAndUpdate(uid, object, { new: true });
        res.json({
            ok: true,
            msg: 'Curso actualizado',
            cursoUpdate
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error en actualizarCurso'
        });
    }
}

//DELETE

const eliminarCurso = async(req, res = response) => {
    const uid = req.params.id;

    try {
        const existeCurso = await Curso.findById(uid);
        if (!existeCurso) {
            return res.status(400).json({
                ok: false,
                msg: 'Curso no existe'
            });
        }
        const resultado = await Curso.findByIdAndRemove(uid);
        res.json({
            ok: true,
            msg: 'Curso eliminado',
            resultado
        });


    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'error en eliminarCurso'
        });
    }
}

module.exports = { getCursos, crearCurso, actualizarCurso, eliminarCurso };