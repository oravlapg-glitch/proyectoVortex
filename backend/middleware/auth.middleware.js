// Middlewares de autenticación con JWT (el token que devuelve el login)
// El token se envía en la cabecera de la petición:  Authorization: Bearer <token>
const jwt = require("jsonwebtoken")

// Comprueba que hay un token válido y guarda sus datos (id, nombre, rol) en req.user
// para que los middlewares y controladores siguientes sepan quién hace la petición
const verificarToken = (req, res, next) => {

    const authHeader = req.headers.authorization;

    // Si no viene la cabecera → no ha iniciado sesión
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).send("Necesitas iniciar sesión")
    }

    // "Bearer eyJhbGci..." → split(" ") separa por el espacio y [1] se queda con el token
    const token = authHeader.split(" ")[1];

    try {
        // jwt.verify comprueba la firma con la clave del .env. Si el token es falso o ha caducado, lanza un error
        req.user = jwt.verify(token, process.env.TOKEN_PASSWORD);
        next();
    } catch (error) {
        return res.status(401).send("Token inválido o caducado")
    }
}

// Solo deja pasar a los usuarios con alguno de los roles indicados
// Uso: permitirRoles("ADMIN")  o  permitirRoles("AGENTE", "ADMIN")
// Va SIEMPRE después de verificarToken (necesita req.user)
const permitirRoles = (...rolesPermitidos) => {

    return (req, res, next) => {

        if (!rolesPermitidos.includes(req.user.rol)) {
            // 403 = has iniciado sesión, pero no tienes permiso
            return res.status(403).send("NO TIENES PERMISO PARA ESTO!")
        }

        next();
    }
}

module.exports = { verificarToken, permitirRoles };
