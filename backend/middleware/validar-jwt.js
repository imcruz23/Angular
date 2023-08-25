const jwt = require('jsonwebtoken');

// Funcion anonima para validar el jsonwebtoken
const validarJWT = (req, res, next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(400).json({
            ok: false,
            msg: 'Falta token de autorización'
        });
    }

    try {
        const { uid, rol, ...object } = jwt.verify(token, process.env.JWTSECRET);
        req.uid = uid;
        req.rol = rol;
        next();

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Token no valido'
        });
    }
}

module.exports = { validarJWT };