/*
Ruta base: /api/cursos
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { getCursos, crearCurso, actualizarCurso, eliminarCurso } = require('../controllers/cursos');
const { validarJWT } = require('../middleware/validar-jwt');
const { validarRol } = require('../middleware/validar-rol');
const { validarCampos } = require('../middleware/validar-campos');

const router = Router();
// GET 
router.get('/', [
    validarJWT,
    check('id', 'El id debe ser correcto').optional().isMongoId(),
    check('from', 'El from debe ser valido').optional().isNumeric(),
    validarCampos
], getCursos);

// POST
router.post('/', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').notEmpty(),
    check('nombrecorto', 'El argumento nombrecorto es obligatorio').notEmpty(),
    validarCampos
], crearCurso);

//PUT
router.put('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    check('nombre', 'El argumento nombre es obligatorio').notEmpty(),
    check('nombrecorto', 'El argumento nombrecorto es obligatorio').notEmpty(),
    validarCampos
], actualizarCurso);

router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], eliminarCurso);

module.exports = router;