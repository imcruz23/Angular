const { response } = require('express');
const { validationResult } = require('express-validator');

// funcion anonima para validar campos
const validarCampos = (req, res = response, next) => {
    const erroresVal = validationResult(req);

    if (!erroresVal.isEmpty()) {
        // Devolvemos los errores de ruta si hay
        return res.status(400).json({
            ok: false,
            errores: erroresVal.mapped()
        });
    }
    next();
}
module.exports = { validarCampos }