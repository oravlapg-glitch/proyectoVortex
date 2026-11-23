const { Ticket, ESTADOS, PRIORIDADES } = require("../model/ticket.model");
const Categoria = require("../model/categoria.model");
const Usuario = require("../model/usuario.model");
const Pedido = require("../model/pedido.model");

// Cambios de estado permitidos para cada rol → { estadoActual: [estados a los que puede pasar] }
// El ADMIN puede hacer cualquier cambio
const TRANSICIONES = {
    AGENTE: {
        abierto: ["en_curso"],
        en_curso: ["pendiente_cliente", "resuelto"],
        pendiente_cliente: ["en_curso", "resuelto"],
        resuelto: ["en_curso"]
    },
    CLIENTE: {
        resuelto: ["cerrado", "en_curso"] // confirmar el cierre o pedir que se reabra
    }
}

// ¿Este usuario puede ver/tocar este ticket? → LA comprobación clave de la defensa
// CLIENTE: solo los suyos. AGENTE: solo los que tiene asignados. ADMIN: todos
const puedeAcceder = (ticket, user) => {
    if (user.rol == "ADMIN") return true;
    if (user.rol == "CLIENTE") return String(ticket.cliente) == user.id;
    if (user.rol == "AGENTE") return ticket.agente != null && String(ticket.agente) == user.id;
    return false;
}

// Busca el ticket de la URL y comprueba el permiso. Si algo falla, responde y devuelve null
// Se usa en TODAS las rutas con :id, así no se puede olvidar en ninguna
const buscarTicketConPermiso = async (req, res) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
        res.status(404).send("ticket no encontrado");
        return null;
    }
    if (!puedeAcceder(ticket, req.user)) {
        res.status(403).send("No tienes acceso a este ticket");
        return null;
    }
    return ticket;
}

// Cambia el estado y lo apunta en el historial (quién, de qué estado a qué estado)
const cambiarEstadoConHistorial = (ticket, nuevoEstado, idUsuario) => {
    ticket.historial.push({ usuario: idUsuario, de: ticket.estado, a: nuevoEstado });
    ticket.estado = nuevoEstado;
}

class TicketController {

  // Abrir un ticket (CLIENTE o ADMIN)
  // Body: { "asunto": "...", "descripcion": "...", "categoria": "<id>", "pedido": "<id opcional>" }
  async createTicket(req, res){
    try {
        const categoria = await Categoria.findById(req.body.categoria);
        if (!categoria || !categoria.activa){
            return res.status(400).send("La categoría no existe o no está activa")
        }

        // Reclamación de un pedido: tiene que ser MÍO y estar recogido
        let idPedido = null;
        if (req.body.pedido) {
            const pedido = await Pedido.findById(req.body.pedido);
            if (!pedido || String(pedido.cliente) != req.user.id){
                return res.status(404).send("pedido no encontrado")
            }
            if (pedido.estado != "recogido"){
                return res.status(400).send("Solo se pueden reclamar pedidos ya recogidos")
            }
            idPedido = pedido._id;
        }

        const ticketNuevo = new Ticket({
            cliente: req.user.id, // el dueño SIEMPRE sale del token, nunca del body
            categoria: categoria._id,
            pedido: idPedido,
            asunto: req.body.asunto,
            descripcion: req.body.descripcion,
            prioridad: categoria.prioridadPorDefecto,
            historial: [{ usuario: req.user.id, de: null, a: "abierto" }]
        });
        const result = await ticketNuevo.save();
        return res.status(201).send(result)
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

  // Lista de tickets. Cada rol ve lo suyo:
  // CLIENTE → los suyos | AGENTE → los asignados | ADMIN → todos (puede filtrar por cliente y agente)
  // GET /api/tickets?estado=abierto&prioridad=alta&cliente=<id>&agente=<id o sin_asignar>
  async getTickets(req, res){
    try {
        let filter = {}
        if (req.user.rol == "CLIENTE") {
            filter.cliente = req.user.id
        }
        if (req.user.rol == "AGENTE") {
            filter.agente = req.user.id
        }
        if (req.user.rol == "ADMIN") {
            if (req.query.cliente) {
                filter.cliente = req.query.cliente
            }
            if (req.query.agente == "sin_asignar") {
                filter.agente = null
            } else if (req.query.agente) {
                filter.agente = req.query.agente
            }
        }
        if (req.query.estado) {
            filter.estado = req.query.estado
        }
        if (req.query.prioridad) {
            filter.prioridad = req.query.prioridad
        }

        const result = await Ticket.find(filter)
            .select("-mensajes -historial") // en la lista no hace falta todo
            .populate("cliente", "nombre email")
            .populate("agente", "nombre")
            .populate("categoria", "nombre")
            .sort({ updatedAt: -1 });
        return res.status(200).send(result)
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

  // Métricas del panel de admin: total, cuántos hay en cada estado y cuántos sin asignar
  async getMetricas(req, res){
    try {
        let porEstado = {}
        let total = 0
        for (const estado of ESTADOS) {
            porEstado[estado] = await Ticket.countDocuments({ estado: estado });
            total = total + porEstado[estado];
        }
        const sinAsignar = await Ticket.countDocuments({ agente: null, estado: { $ne: "cerrado" } });
        return res.status(200).send({ total: total, porEstado: porEstado, sinAsignar: sinAsignar })
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

  // Detalle con mensajes e historial (con los nombres gracias a populate)
  async getTicketById(req, res){
    try {
        const ticket = await buscarTicketConPermiso(req, res);
        if (!ticket) return; // ya se respondió con 404 o 403

        const result = await Ticket.findById(req.params.id)
            .populate("cliente", "nombre email")
            .populate("agente", "nombre")
            .populate("categoria", "nombre")
            .populate("pedido", "codigo lineas total estado")
            .populate("mensajes.autor", "nombre rol")
            .populate("historial.usuario", "nombre rol");
        return res.status(200).send(result)
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

  // Responder en el ticket. Body: { "texto": "..." }
  async addMensaje(req, res){
    try {
        const ticket = await buscarTicketConPermiso(req, res);
        if (!ticket) return;

        if (ticket.estado == "cerrado"){
            return res.status(400).send("El ticket está cerrado")
        }
        ticket.mensajes.push({ autor: req.user.id, texto: req.body.texto });

        // Si el agente esperaba al cliente y el cliente contesta → vuelve solo a "en curso"
        if (req.user.rol == "CLIENTE" && ticket.estado == "pendiente_cliente") {
            cambiarEstadoConHistorial(ticket, "en_curso", req.user.id);
        }
        await ticket.save();
        return res.status(201).send(ticket.mensajes[ticket.mensajes.length - 1])
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

  // Cambiar estado según las reglas de TRANSICIONES. Body: { "estado": "en_curso" }
  async updateEstado(req, res){
    try {
        const nuevoEstado = req.body.estado;
        if (!ESTADOS.includes(nuevoEstado)){
            return res.status(400).send("Estado no válido. Usa: " + ESTADOS.join(", "))
        }
        const ticket = await buscarTicketConPermiso(req, res);
        if (!ticket) return;

        if (ticket.estado == nuevoEstado){
            return res.status(400).send("El ticket ya está en " + nuevoEstado)
        }
        if (req.user.rol != "ADMIN") {
            const permitidos = TRANSICIONES[req.user.rol][ticket.estado] || [];
            if (!permitidos.includes(nuevoEstado)){
                return res.status(400).send("No puedes pasar de " + ticket.estado + " a " + nuevoEstado)
            }
        }
        cambiarEstadoConHistorial(ticket, nuevoEstado, req.user.id);
        const result = await ticket.save();
        return res.status(200).send(result)
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

  // Cambiar prioridad (AGENTE asignado o ADMIN). Body: { "prioridad": "alta" }
  async updatePrioridad(req, res){
    try {
        if (!PRIORIDADES.includes(req.body.prioridad)){
            return res.status(400).send("Prioridad no válida (baja, media, alta)")
        }
        const ticket = await buscarTicketConPermiso(req, res);
        if (!ticket) return;

        ticket.prioridad = req.body.prioridad;
        const result = await ticket.save();
        return res.status(200).send(result)
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

  // Asignar o reasignar a un agente (solo ADMIN). Body: { "agente": "<id de un AGENTE>" }
  async asignarAgente(req, res){
    try {
        const agente = await Usuario.findById(req.body.agente);
        if (!agente || agente.rol != "AGENTE" || !agente.activo){
            return res.status(400).send("El usuario indicado no es un agente activo")
        }
        const ticket = await buscarTicketConPermiso(req, res);
        if (!ticket) return;

        if (ticket.estado == "cerrado"){
            return res.status(400).send("No se puede asignar un ticket cerrado")
        }
        ticket.agente = agente._id;
        const result = await ticket.save();
        return res.status(200).send(result)
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

module.exports = new TicketController();
