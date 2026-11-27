const {Ticket,ESTADOS, PRIORIDADES} = require("../model/ticket.model");
const Categoria = require("../model/categoria.model");
const Usuario = require("../model/usuario.model");
const Pedido = require("../model/pedido.model")

const TRANSICIONES ={
    AGENTE: {
        abierto: ["en_curso"],
        en_curso: ["pendiente_cliente", "resuelto"],
        pendiente_cliente: ["en_curso", "resuelto"],
        resuelto: ["en_curso"] 
    },
    CLIENTE: {
        resuelto: ["cerrado", "en_curso"]
    }
}
const puedeAcceder = (ticket, user) => {
    if (user.rol == "ADMIN") return true;
    if (user.rol == "CLIENTE") return String(ticket.cliente)== user.id;
    if (user.rol =="AGENTE") return ticket.agente != null && String(ticket.agente) == user.id;
    return false;
}
const buscarTicketConPermiso = async (req, res) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket){
        res.status(404).send("ticket no encontrado");
        return null;
    }
    if (!puedeAcceder(ticket, req.user)){
        res.status(403).send("No tiene acceso a este ticket");
        return null;
    }
    return ticket;
}
const cambiarEstadoConHistorial = (ticket, nuevoEstado, idUsuario) => {
    ticket.historial.push({usuario: idUsuario, de: ticket.estado, a: nuevoEstado});
    ticket.estado = nuevoEstado;
}

class TicketController {
    async createTicket(req, res){
        try{
            const categoria = await Categoria.findById(req.body.categoria);
            if (!categoria || !categoria.activa){
                return res.status(400).send(" la categoria no existe o no esta activa")
            }
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
                cliente: req.user.id, 
                categoria: categoria._id,
                pedido: idPedido,
                asunto: req.body.asunto,
                descripcion: req.body.descripcion,
                prioridad: categoria.prioridadPorDefecto,
                historial: [{ usuario: req.user.id, de: null,  a: "abierto"}]
            });
            const result  = await ticketNuevo.save();
            return res.status(201).send(result)
        }catch (error){
            console.log(error);
                if (error.name == "CastError"){
                return res.status(400).send("Id no valido")
            }
            if (error.name == "ValidationError"){
                return res.status(400).send("Datos no validos: "+error.message)
            }
            if (error.code == 11000){
                return res.status(409).send("Ya existe un registro")
            }
            return res.status(500).send("Error interno")
            }
        }
    async getTickets(req, res){
        try{
            let filter ={}
            if (req.user.rol == "CLIENTE"){
                filter.cliente = req.user.id
            }
            if (req.user.rol == "AGENTE"){
                filter.agente = req.user.id
            }
            if (req.user.rol == "ADMIN"){
                if (req.query.cliente){
                    filter.cliente = req.query.cliente
                }
                if (req.query.agente == "sin_asignar"){
                    filter.agente = null
                } else if (req.query.agente){
                    filter.agente = req.query.agente
                }
            }
            if (req.query.estado){
                filter.estado = req.query.estado
            }
            if (req.query.prioridad){
                filter.prioridad = req.query.prioridad
            }
            const result = await Ticket.find(filter)
                .select("-mensajes -historial")
                .populate("cliente", "nombre email")
                .populate("agente", "nombre")
                .populate("categoria", "nombre")
                .sort({updatedAt: -1});
            return res.status(200).send(result)
        }catch (error) {
            console.log(error);
            if (error.name == "CastError"){
                return res.status(400).send("Id no valido")
            }
            if (error.name == "ValidationError"){
                return res.status(400).send("Datos no validos: "+error.message)
            }
            if (error.code == 11000){
                return res.status(409).send("Ya existe un registro")
            }
            return res.status(500).send("Error interno")
        }
    }
    async getMetricas(req, res){
        try{
            let porEstado = {}
            let total = 0
            for (const estado of ESTADOS){
                porEstado[estado] = await Ticket.countDocuments({ estado: estado});
                total = total + porEstado[estado];
            }
            const sinAsignar = await Ticket.countDocuments({ agente: null,estado: {$ne: "cerrado"}});
            return res.status(200).send({total: total, porEstado: porEstado, sinAsignar: sinAsignar})
        } catch (error) {
            console.log(error);
            if (error.name == "CastError"){
                return res.status(400).send("Id no valido")
            }
            if (error.name == "ValidationError"){
                return res.status(400).send("Datos no validos: "+ error.message)
            }
            if (error.code == 11000){
                return res.status(409).send("ya existe un registro")
            }
            return res.status(500).send("Error interno")
        }
    }
    async getTicketById(req, res){
        try{
            const ticket = await buscarTicketConPermiso(req, res);
            if (!ticket) return;
            const result = await Ticket.findById(req.params.id)
                 .populate("cliente", "nombre email")
                 .populate("agente",  "nombre")
                 .populate("categoria", "nombre")
                 .populate("pedido", "codigo lineas total estado")
                 .populate("mensajes.autor", "nombre rol")
                 .populate("historial.usuario", "nombre rol");
            return res.status(200).send(result)
        }catch (error){
            console.log(error);
            if (error.name == "CastError"){
                return res.status(400).send("Id no valido")
            }
            if (error.name == "ValidationError"){
                return res.status(400).send("Datos no validos: "+ error.message)
            }
            if (error.code == 11000){
                return res.status(409).send("ya existe un registro")
            }
            return res.status(500).send("Error interno")
        }
    }
    async addMensaje(req, res){
        try{
            const ticket = await buscarTicketConPermiso(req, res);
            if (!ticket) return;
            if (ticket.estado == "cerrado"){
                return res.status(400).send("El ticket esta cerrado")
            }
            ticket.mensajes.push({ autor: req.user.id, texto: req.body.texto});
            if (req.user.rol == "CLIENTE" && ticket.estado == "pendiente_cliente"){
                cambiarEstadoConHistorial(ticket, "en_curso", req.user.id);
            }
            await ticket.save();
            return res.status(201).send(ticket.mensajes[ticket.mensajes.length -1])
        }catch (error){
            console.log(error);
            if (error.name == "CastError"){
                return res.status(400).send("Id no valido")
            }
            if (error.name == "ValidationError"){
                return res.status(400).send("Datos no validos: "+ error.message)
            }
            if (error.code == 11000){
                return res.status(409).send("ya existe un registro")
            }
            return res.status(500).send("Error interno")
        }
    }
    async updateEstado(req, res){
        try {
            const nuevoEstado = req.body.estado;
            if (!ESTADOS.includes(nuevoEstado)){
                return res.status(400).send("Estado no valido. Usa: "+ ESTADOS.join(", "))
            }
            const ticket = await buscarTicketConPermiso(req, res);
            if (!ticket) return;
            if (ticket.estado == nuevoEstado){
                return res.status(400).send("El ticket ya esta en "+ nuevoEstado)
            }
            if (req.user.rol != "ADMIN"){
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
            if (error.name == "CastError"){
                return res.status(400).send("Id no valido")
            }
            if (error.name == "ValidationError"){
                return res.status(400).send("Datos no validos: "+ error.message)
            }
            if (error.code == 11000){
                return res.status(409).send("ya existe un registro")
            }
            return res.status(500).send("Error interno")
        }
    }
    async updatePrioridad(req, res){
        try {
            if (!PRIORIDADES.includes(req.body.prioridad)){
                return res.status(400).send("Prioridad no valida (baja, media, alta)")
            }
            const ticket = await buscarTicketConPermiso(req, res);
            if (!ticket) return;

            ticket.prioridad = req.body.prioridad;
            const result = await ticket.save();
            return res.status(200).send(result)
        } catch (error) {
            console.log(error);
            if (error.name == "CastError"){
                return res.status(400).send("Id no valido")
            }
            if (error.name == "ValidationError"){
                return res.status(400).send("Datos no validos: "+ error.message)
            }
            if (error.code == 11000){
                return res.status(409).send("ya existe un registro")
            }
            return res.status(500).send("Error interno")
        }
    }
    async asignarAgente(req, res){
        try{
            const agente = await Usuario.findById(req.body.agente);
            if (!agente || agente.rol != "AGENTE" ){
                return res.status(400).send("El usuario indicado no es un agente")
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
            if (error.name == "CastError"){
                return res.status(400).send("Id no valido")
            }
            if (error.name == "ValidationError"){
                return res.status(400).send("Datos no validos: "+ error.message)
            }
            if (error.code == 11000){
                return res.status(409).send("ya existe un registro")
            }
            return res.status(500).send("Error interno")
        }
    }
}
module.exports = new TicketController();