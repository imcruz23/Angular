/*
    Ruta base: /api/asignaturas
*/
const { Router } = require('express');
const { validarJWT } = require('../middleware/validar-jwt');
const { validarCampos } = require('../middleware/validar-campos');
const { check } = require('express-validator');
const { actualizarCurso } = require('../controllers/cursos');

const { getAsignaturas, crearAsignatura, actualizarAsignatura, borrarAsignatura } = require('../controllers/asignaturas');

const router = Router();

router.get('/', [
    validarJWT,
    check('id', 'El identificador no es correcto').optional().isMongoId(),
    check('from', 'El from debe ser válido').optional().isNumeric(),
    validarCampos
], getAsignaturas);

router.post('/', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').notEmpty().trim(),
    check('nombrecorto', 'El argumento nombrecorto es obligatorio').notEmpty().trim(),
    check('curso', 'El argumento curso es obligatorio').isMongoId(),
    check('profesores.*.usuario', 'El identificador de profesor no es válido').optional().isMongoId(),
    validarCampos
], crearAsignatura);

router.put('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    check('nombre', 'El argumento nombre es obligatorio').notEmpty(),
    check('nombrecorto', 'El argumento nombercorto es obligatorio').notEmpty(),
    check('curso', 'El argumento curso no es válido').isMongoId(),
    // Si viene lista de profesores, comprobar el id
    check('profesores.*.usuario', 'El identificador de profesor no es válido').optional().isMongoId(),
    validarCampos
], actualizarAsignatura);

router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], borrarAsignatura);

module.exports = router;