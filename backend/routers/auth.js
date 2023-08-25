/*
Ruta base: /api/login
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { login } = require('../controllers/auth');

const router = Router();

router.post('/', [
    check('password', 'El argumento password es obligatorio').notEmpty(),
    check('email', 'El argumento email es obligatorio').notEmpty(),
    validarCampos
], login);

module.exports = router;