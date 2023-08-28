/*
    Ruta base: /api/usuarios
*/
const { Router } = require('express');
const { getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario } = require('../controllers/usuarios');
// Importar express validator
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarRol, rolEsAdmin } = require('../middleware/validar-rol');
const { validarJWT, validarJWTRolAdmin } = require('../middleware/validar-jwt');

const router = Router();

router.get('/', [
    validarJWT,
    check('id', 'El id del usuario debe ser válido').optional().isMongoId(),
    check('from', 'El from debe ser numérico').optional().isNumeric(),
    validarCampos
], getUsuarios);

router.post('/', [
    validarJWT,
    // comprobamos mediante el validator si hay errores
    check('nombre', 'El argumento nombre es obligatorio').notEmpty().trim(),
    check('apellidos', 'El argumento apellidos es obligatorio').notEmpty().trim(),
    check('email', 'El argumento email es obligatorio').isEmail(),
    check('password', 'El argumento password es obligatorio').notEmpty().trim(),
    // campos opcionales
    check('activo', 'El estado activo debe ser true/false').optional().isBoolean(),
    validarCampos,
], crearUsuario);

router.put('/:id', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').notEmpty().trim(),
    check('apellidos', 'El argumento apellidos es obligatorio').notEmpty().trim(),
    check('email', 'El argumento email es obligatorio').isEmail(),
    check('id', 'El identificador no es válido').isMongoId(),
    check('activo', 'El estado activo debe ser true/false').optional().isBoolean(),
    validarCampos,
    validarRol
], actualizarUsuario);

router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
], borrarUsuario);

module.exports = router;