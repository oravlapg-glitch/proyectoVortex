const Usuario = require("../model/usuario.model");
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const usuarios = require("../bbdd/usuarios");

class UsuarioController {

  // Carga los usuarios de prueba con la contraseña encriptada
  // Si ya existen, los deja como al principio (no se duplican)
  async cargaInicial(req, res){
    try {
        for (const usuario of usuarios) {
          const passwordEncriptado = await bcrypt.hash(usuario.password, 10);
          // upsert: true → si existe un usuario con ese email lo actualiza; si no, lo crea
          await Usuario.updateOne(
            { email: usuario.email },
            { ...usuario, password: passwordEncriptado, activo: true },
            { upsert: true }
          );
        }
        return res.status(201).send("Carga de usuarios completa!");
    } catch (error) {
        console.log(error);
        // id mal escrito (ejemplo: /api/espacios/hola) → 400
        if (error.name == "CastError") {
            return res.status(400).send("Id no válido")
        }
        // datos que no cumplen el modelo (required, enum, min...) → 400
        if (error.name == "ValidationError") {
            return res.status(400).send("Datos no válidos: " + error.message)
        }
        // unique repetido (email, nombre...) → 409
        if (error.code == 11000) {
            return res.status(409).send("Ya existe un registro con esos datos")
        }
        // cualquier otro fallo → 500
        return res.status(500).send("Error interno")
    }
  }

  // Registro: SIEMPRE crea un CLIENTE, aunque en el body manden otro rol
  async signUp(req, res){
    try {
        // No puede haber dos usuarios con el mismo email → 409 (conflicto)
        const existe = await Usuario.findOne({ email: String(req.body.email).toLowerCase() });
        if (existe){
            return res.status(409).send("Ese email ya está registrado")
        }
        const passwordEncriptado = await bcrypt.hash(req.body.password, 10)
        const usuario = new Usuario({
            nombre: req.body.nombre,
            email: req.body.email,
            password: passwordEncriptado,
            rol: "CLIENTE" // nunca req.body.rol: nadie puede registrarse como admin
        })
        const result = await usuario.save();
        // No devolvemos la contraseña
        return res.status(201).send({ id: result._id, nombre: result.nombre, email: result.email, rol: result.rol });
    } catch (error) {
        console.log(error);
        // id mal escrito (ejemplo: /api/espacios/hola) → 400
        if (error.name == "CastError") {
            return res.status(400).send("Id no válido")
        }
        // datos que no cumplen el modelo (required, enum, min...) → 400
        if (error.name == "ValidationError") {
            return res.status(400).send("Datos no válidos: " + error.message)
        }
        // unique repetido (email, nombre...) → 409
        if (error.code == 11000) {
            return res.status(409).send("Ya existe un registro con esos datos")
        }
        // cualquier otro fallo → 500
        return res.status(500).send("Error interno")
    }
  }

  // Login: comprueba email y contraseña y devuelve un token
  async logIn(req, res){
    try {
        // select("+password") porque en el modelo tiene select: false
        const user = await Usuario.findOne({ email: String(req.body.email).toLowerCase() }).select("+password");
        const isTruePassword = user ? await bcrypt.compare(req.body.password, user.password) : false;

        // 401 = credenciales incorrectas. Mismo mensaje en los dos casos para no dar pistas
        if (!user || !isTruePassword){
            return res.status(401).send("Email o contraseña incorrectos")
        }
        if (!user.activo){
            return res.status(403).send("Tu cuenta está desactivada")
        }

        // El token lleva dentro el id, el nombre y el rol. Caduca en 2 horas
        const token = jwt.sign(
            { id: user._id, nombre: user.nombre, rol: user.rol },
            process.env.TOKEN_PASSWORD,
            { expiresIn: "2h" }
        )

        return res.status(200).json({
            mensaje: "Inicio de sesión correcto",
            token: token,
            usuario: { id: user._id, nombre: user.nombre, email: user.email, rol: user.rol }
        });
    } catch (error) {
        console.log(error);
        // id mal escrito (ejemplo: /api/espacios/hola) → 400
        if (error.name == "CastError") {
            return res.status(400).send("Id no válido")
        }
        // datos que no cumplen el modelo (required, enum, min...) → 400
        if (error.name == "ValidationError") {
            return res.status(400).send("Datos no válidos: " + error.message)
        }
        // unique repetido (email, nombre...) → 409
        if (error.code == 11000) {
            return res.status(409).send("Ya existe un registro con esos datos")
        }
        // cualquier otro fallo → 500
        return res.status(500).send("Error interno")
    }
  }

  // Mis datos (el id sale del token, no de la URL)
  async getMe(req, res){
    try {
        const result = await Usuario.findById(req.user.id);
        if (!result){
            return res.status(404).send("usuario no encontrado")
        }
        return res.status(200).send(result);
    } catch (error) {
        console.log(error);
        // id mal escrito (ejemplo: /api/espacios/hola) → 400
        if (error.name == "CastError") {
            return res.status(400).send("Id no válido")
        }
        // datos que no cumplen el modelo (required, enum, min...) → 400
        if (error.name == "ValidationError") {
            return res.status(400).send("Datos no válidos: " + error.message)
        }
        // unique repetido (email, nombre...) → 409
        if (error.code == 11000) {
            return res.status(409).send("Ya existe un registro con esos datos")
        }
        // cualquier otro fallo → 500
        return res.status(500).send("Error interno")
    }
  }

  // Editar mis datos: nombre, email y contraseña. El rol NUNCA
  async updateMe(req, res){
    try {
        const usuario = await Usuario.findById(req.user.id);
        if (!usuario){
            return res.status(404).send("usuario no encontrado")
        }
        if (req.body.nombre) usuario.nombre = req.body.nombre;
        if (req.body.email) usuario.email = req.body.email;
        if (req.body.password) {
            if (String(req.body.password).length < 6) {
                return res.status(400).send("La contraseña debe tener al menos 6 caracteres")
            }
            usuario.password = await bcrypt.hash(req.body.password, 10);
        }
        // save() pasa las validaciones del modelo (email válido, etc.)
        const result = await usuario.save();
        return res.status(200).send(result);
    } catch (error) {
        console.log(error);
        // id mal escrito (ejemplo: /api/espacios/hola) → 400
        if (error.name == "CastError") {
            return res.status(400).send("Id no válido")
        }
        // datos que no cumplen el modelo (required, enum, min...) → 400
        if (error.name == "ValidationError") {
            return res.status(400).send("Datos no válidos: " + error.message)
        }
        // unique repetido (email, nombre...) → 409
        if (error.code == 11000) {
            return res.status(409).send("Ya existe un registro con esos datos")
        }
        // cualquier otro fallo → 500
        return res.status(500).send("Error interno")
    }
  }

  // Lista de usuarios (solo ADMIN). Filtro opcional: ?rol=AGENTE
  async getUsers(req, res){
    try {
        let filter = {}
        if (req.query.rol) {
            filter.rol = req.query.rol
        }
        const result = await Usuario.find(filter).sort({ createdAt: -1 });
        return res.status(200).send(result);
    } catch (error) {
        console.log(error);
        // id mal escrito (ejemplo: /api/espacios/hola) → 400
        if (error.name == "CastError") {
            return res.status(400).send("Id no válido")
        }
        // datos que no cumplen el modelo (required, enum, min...) → 400
        if (error.name == "ValidationError") {
            return res.status(400).send("Datos no válidos: " + error.message)
        }
        // unique repetido (email, nombre...) → 409
        if (error.code == 11000) {
            return res.status(409).send("Ya existe un registro con esos datos")
        }
        // cualquier otro fallo → 500
        return res.status(500).send("Error interno")
    }
  }

  // Cambiar el rol de un usuario (solo ADMIN). Body: { "rol": "AGENTE" }
  async cambiarRol(req, res){
    try {
        if (!["CLIENTE", "AGENTE", "ADMIN"].includes(req.body.rol)) {
            return res.status(400).send("Rol no válido")
        }
        if (req.params.id === req.user.id) {
            return res.status(400).send("No puedes cambiar tu propio rol")
        }
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario){
            return res.status(404).send("usuario no encontrado")
        }
        usuario.rol = req.body.rol;
        const result = await usuario.save();
        return res.status(200).send(result);
    } catch (error) {
        console.log(error);
        // id mal escrito (ejemplo: /api/espacios/hola) → 400
        if (error.name == "CastError") {
            return res.status(400).send("Id no válido")
        }
        // datos que no cumplen el modelo (required, enum, min...) → 400
        if (error.name == "ValidationError") {
            return res.status(400).send("Datos no válidos: " + error.message)
        }
        // unique repetido (email, nombre...) → 409
        if (error.code == 11000) {
            return res.status(409).send("Ya existe un registro con esos datos")
        }
        // cualquier otro fallo → 500
        return res.status(500).send("Error interno")
    }
  }

  // Activar o desactivar un usuario (solo ADMIN). Body: { "activo": false }
  // Se desactiva en vez de borrarlo porque tiene tickets, reservas y pedidos
  async cambiarActivo(req, res){
    try {
        if (typeof req.body.activo !== "boolean") {
            return res.status(400).send("activo debe ser true o false")
        }
        if (req.params.id === req.user.id) {
            return res.status(400).send("No puedes desactivarte a ti mismo")
        }
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario){
            return res.status(404).send("usuario no encontrado")
        }
        usuario.activo = req.body.activo;
        const result = await usuario.save();
        return res.status(200).send(result);
    } catch (error) {
        console.log(error);
        // id mal escrito (ejemplo: /api/espacios/hola) → 400
        if (error.name == "CastError") {
            return res.status(400).send("Id no válido")
        }
        // datos que no cumplen el modelo (required, enum, min...) → 400
        if (error.name == "ValidationError") {
            return res.status(400).send("Datos no válidos: " + error.message)
        }
        // unique repetido (email, nombre...) → 409
        if (error.code == 11000) {
            return res.status(409).send("Ya existe un registro con esos datos")
        }
        // cualquier otro fallo → 500
        return res.status(500).send("Error interno")
    }
  }
}

module.exports = new UsuarioController()
