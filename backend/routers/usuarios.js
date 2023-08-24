/*
    Ruta base: /api/usuarios
*/
const { Router } = require('express');
const { getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario } = require('../controllers/usuarios');
// Importar express validator
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarRol } = require('../middleware/validar-rol');

const router = Router();

router.get('/', getUsuarios);

router.post('/', [
    // comprobamos mediante el validator si hay errores
    check('nombre', 'El argumento nombre es obligatorio').notEmpty(),
    check('apellidos', 'El argumento apellidos es obligatorio').notEmpty(),
    check('email', 'El argumento email es obligatorio').notEmpty(),
    check('password', 'El argumento password es obligatorio').notEmpty(),
    validarCampos,
    validarRol
], crearUsuario);

router.put('/:id', [
    check('nombre', 'El argumento nombre es obligatorio').notEmpty(),
    check('apellidos', 'El argumento apellidos es obligatorio').notEmpty(),
    check('email', 'El argumento email es obligatorio').notEmpty(),
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
    validarRol
], actualizarUsuario);

router.delete('/:id', [
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], borrarUsuario);

module.exports = router;