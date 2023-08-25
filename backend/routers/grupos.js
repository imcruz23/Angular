/*
Ruta base: /api/grupos
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');
const { validarRol } = require('../middleware/validar-rol');
const { getGrupos, crearGrupo, actualizarGrupo, borrarGrupo } = require('../controllers/grupos');

const router = Router();

router.get('/', validarJWT, getGrupos);

router.post('/', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').notEmpty(),
    validarCampos
], crearGrupo);

router.put('/:id', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').notEmpty(),
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], actualizarGrupo)

router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], borrarGrupo);

module.exports = router;