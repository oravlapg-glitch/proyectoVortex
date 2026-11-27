const jwt = require("jsonwebtoken")

const verificarToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).send("Necesitas iniaciar sesion")
    }

    const token = authHeader.split(" ")[1];
    try {
        req.user = jwt.verify(token, process.env.TOKEN_PASSWORD);
        next();
    }catch (error) {
        return res.status(401).send("Token invalido o caducado")
    }
}

const permitirRoles = (...rolesPermitidos) => {
    return (req, res, next) => {
        if (!rolesPermitidos.includes(req.user.rol)){
            return res.status(403).send("NO TIENES PERMISO")
        }
        next();
    }
}
module.exports ={
    verificarToken,
    permitirRoles
}