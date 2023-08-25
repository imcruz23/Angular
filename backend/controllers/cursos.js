const { response } = require('express');

// GET
const getCursos = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'getCursos'
    });
}

//POST
const crearCurso = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'crearCurso'
    });

}


//PUT
const actualizarCurso = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'actualizarCurso'
    });
}

//DELETE

const eliminarCurso = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'eliminarCurso'
    });
}

module.exports = { getCursos, crearCurso, actualizarCurso, eliminarCurso };