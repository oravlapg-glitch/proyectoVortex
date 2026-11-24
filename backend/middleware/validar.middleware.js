// Comprobacion de datos necesarios 
// y decidimos si mandamos un error pol falta de datos 
// o dejar pasar la peticion al controlador 
const validarSignup  = (req, res, next) => {
    if (!req.body || !req.body.nombre || !req.body.email || !req.body.password) {
        return res.status(400).send("Faltan datos: nombre, email y passwors son obligatorios")
    }
    //mensaje de error por caracteres minimos de contraseña (8)
    if (String(req.body.password).length < 8){
        return res.status(400).send("Esta contraseña no tiene los 8  caracteres jajaja")
    }
    next();
}

// incio de sesion 
const validarLogin = (req, res, next) => {
    if (!req.body || !req.body.email || !req.body.password)
    {
        return res.status(400).send("Faltan datos: email, password")
    }
    next();
}

//Pc o Sala
const validarEspacio = (req, res, next) => {
    if (!req.body || !req.body.nombre || !req.body.tipo || req.body.capacidad === undefined || req.body.precioHora === undefined){
        return res.status(400).send("Faltan datos, nombre, tipo, capacidad y precioHora")
    }
    next();
}

//Ticket: categoria
const validarCategoria = (req, res, next) => {
    if (!req.body || !req.body.nombre){
        return res.status(400).send("Falta el nombre")
    }
    next();
}

//Ticket nuevo
const validarTicket = (req, res, next) => {
    if (!req.body || !req.body.asunto || !req.body.descripcion || !req.body.categoria){
        return res.status(400).send("Faltan datos: asunto, descripcion y categortia")
    }
    next();
}

//Respuesta en un ticked
const validarMensaje =(req, res, next) => {
    if (!req.body || !req.body.texto || !String(req.body.texto).trim()){
        return res.status(400).send("El mensaje no puede estar vacio")
    }
    next();
}

//Reserva
const validarReserva = (req, res, next) => {
    if(!req.body || !req.body.espacio || !req.body.fecha || req.body.horaInicio === undefined || req.body.horas === undefined){
       return res.status(400).send("Falatan datos: espacio, fecha, horaInicio y horas")
    }
    next();
}

//Producto
const validarProducto = (req, res, next) => {
    if (!req.body || !req.body.nombre || !req.body.categoria || req.body.precio === undefined || req.body.stock === undefined){
        return res.status(400).send("Faltan datos: nombre, categoria, precio, stock")
    }
    next();
}

// Pedido , contiene lista de lineas
const validarPedido = (req, res, next) => {
    if( !req.body || 
        !Array.isArray(req.body.lineas) || // ARRAY:ISARRAY si es una lista o no, comparamos si (req.body.lineas)es una lista 
         req.body.lineas.length === 0){ // comprobamos si la laista esta vacia 
        return res.status(400).send("El pedido necesita un producto")
    }
    next();
}

module.exports = {
    validarSignup,
    validarLogin,
    validarEspacio,
    validarCategoria,
    validarTicket,
    validarMensaje,
    validarReserva,
    validarProducto,
    validarPedido
}