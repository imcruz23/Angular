const jwt = require('jsonwebtoken');

// Funcion que genera un web token
const generarJWT = (uid, rol) => {
    return new Promise((resolve, reject) => {
        const payload = {
            uid,
            rol
        }
        console.log(payload);
        // Firmamos el payload
        jwt.sign(payload, process.env.JWTSECRET, {
            expiresIn: '24h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el JWT');
            } else {
                resolve(token);
            }
        });
    });
}
module.exports = { generarJWT };