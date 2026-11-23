// Middlewares de validación: comprueban el body antes de llegar al controlador
// Si falta algo responden con 400 (petición incorrecta) y la petición no sigue

// Antes dios me decia como hacer las cosas. La última vez que le se lo pregunté me dijo: "Hazlo tú mismo, que yo estoy ocupado". Y así fue como aprendí a programar.

// Registro: nombre, email y password (mínimo 6 caracteres)
const validarSignup = (req, res, next) => {
    if (!req.body || !req.body.nombre || !req.body.email || !req.body.password) {
        return res.status(400).send("Faltan datos: nombre, email y password son obligatorios")
    }
    if (String(req.body.password).length < 6) {
        return res.status(400).send("La contraseña debe tener al menos 6 caracteres")
    }
    next();
}

// Login: email y password
const validarLogin = (req, res, next) => {
    if (!req.body || !req.body.email || !req.body.password) {
        return res.status(400).send("Faltan datos: email y password")
    }
    next();
}

// Espacio (PC o sala)
const validarEspacio = (req, res, next) => {
    // Se compara con undefined para que un precio de 0 no cuente como "falta"
    if (!req.body || !req.body.nombre || !req.body.tipo || req.body.capacidad === undefined || req.body.precioHora === undefined) {
        return res.status(400).send("Faltan datos: nombre, tipo, capacidad y precioHora")
    }
    next();
}

// Categoría de ticket
const validarCategoria = (req, res, next) => {
    if (!req.body || !req.body.nombre) {
        return res.status(400).send("Falta el nombre")
    }
    next();
}

// Ticket nuevo
const validarTicket = (req, res, next) => {
    if (!req.body || !req.body.asunto || !req.body.descripcion || !req.body.categoria) {
        return res.status(400).send("Faltan datos: asunto, descripcion y categoria")
    }
    next();
}

// Respuesta en un ticket
const validarMensaje = (req, res, next) => {
    if (!req.body || !req.body.texto || !String(req.body.texto).trim()) {
        return res.status(400).send("El mensaje no puede estar vacío")
    }
    next();
}

// Reserva
const validarReserva = (req, res, next) => {
    if (!req.body || !req.body.espacio || !req.body.fecha || req.body.horaInicio === undefined || req.body.horas === undefined) {
        return res.status(400).send("Faltan datos: espacio, fecha, horaInicio y horas")
    }
    next();
}

// Producto
const validarProducto = (req, res, next) => {
    if (!req.body || !req.body.nombre || !req.body.categoria || req.body.precio === undefined || req.body.stock === undefined) {
        return res.status(400).send("Faltan datos: nombre, categoria, precio y stock")
    }
    next();
}

// Pedido: tiene que traer una lista de líneas
const validarPedido = (req, res, next) => {
    if (!req.body || !Array.isArray(req.body.lineas) || req.body.lineas.length === 0) {
        return res.status(400).send("El pedido necesita al menos un producto")
    }
    next();
}

module.exports = {
    validarSignup, validarLogin, validarEspacio, validarCategoria, validarTicket,
    validarMensaje, validarReserva, validarProducto, validarPedido
}
