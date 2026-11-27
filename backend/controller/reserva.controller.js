const Reserva = require("../model/reserva.model");
const Espacio = require("../model/espacio.model");

const APERTURA = 10;
const CIERRE = 23;

const ahoraEnMadrid = () => {
    const partes = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", hourCycle: "h23"
    }).formatToParts(new Date());
    const p = Object.fromEntries(partes.map(x => [x.type, x.value]));
    return { fecha: `${p.year}-${p.month}-${p.day}`, hora: Number(p.hour) };
}

const esFechaValida = (texto) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(texto)) return false;
    const d = new Date(texto + "T00:00:00Z");
    return !isNaN(d) && d.toISOString().slice(0, 10) == texto;
}

class ReservaController {

  async getDisponibilidad(req, res){
    try {
        if (!req.query.espacio || !esFechaValida(req.query.fecha || "")){
            return res.status(400).send("Indica espacio y fecha (AAAA-MM-DD)")
        }
        const reservas = await Reserva.find({ espacio: req.query.espacio, fecha: req.query.fecha, estado: "confirmada" });
        let franjas = []
        for (let hora = APERTURA; hora < CIERRE; hora++) {
            const ocupada = reservas.some(r => r.horaInicio <= hora && r.horaFin > hora);
            franjas.push({ hora: hora, libre: !ocupada });
        }
        return res.status(200).send({ espacio: req.query.espacio, fecha: req.query.fecha, franjas: franjas })
    } catch (error) {
        console.log(error);
        if (error.name == "CastError") {
            return res.status(400).send("Id no válido")
        }
        if (error.name == "ValidationError") {
            return res.status(400).send("Datos no válidos: " + error.message)
        }
        if (error.code == 11000) {
            return res.status(409).send("Ya existe un registro con esos datos")
        }
        return res.status(500).send("Error interno")
    }
  }

  async createReserva(req, res){
    try {
        const fecha = req.body.fecha;
        const horaInicio = Number(req.body.horaInicio);
        const horas = Number(req.body.horas);
        const horaFin = horaInicio + horas;

        if (!esFechaValida(fecha)){
            return res.status(400).send("Fecha no válida (formato AAAA-MM-DD)")
        }
        if (!Number.isInteger(horaInicio) || !Number.isInteger(horas) || horas < 1 || horas > 4){
            return res.status(400).send("horaInicio debe ser una hora entera y horas entre 1 y 4")
        }
        if (horaInicio < APERTURA || horaFin > CIERRE){
            return res.status(400).send(`El horario es de ${APERTURA}:00 a ${CIERRE}:00`)
        }
        const ahora = ahoraEnMadrid();
        if (fecha < ahora.fecha || (fecha == ahora.fecha && horaInicio <= ahora.hora)){
            return res.status(400).send("No se puede reservar en el pasado")
        }

        const espacio = await Espacio.findById(req.body.espacio);
        if (!espacio || !espacio.activo){
            return res.status(404).send("espacio no encontrado")
        }

        const choque = await Reserva.findOne({
            espacio: espacio._id,
            fecha: fecha,
            estado: "confirmada",
            horaInicio: { $lt: horaFin },
            horaFin: { $gt: horaInicio }
        });
        if (choque){
            return res.status(409).send("Ese espacio ya está reservado en esa franja")
        }

        const reservaNueva = new Reserva({
            cliente: req.user.id,
            espacio: espacio._id,
            fecha: fecha,
            horaInicio: horaInicio,
            horaFin: horaFin,
            precioTotal: espacio.precioHora * horas
        });
        const result = await reservaNueva.save();
        return res.status(201).send(result)
    } catch (error) {
        console.log(error);
        if (error.name == "CastError") {
            return res.status(400).send("Id no válido")
        }
        if (error.name == "ValidationError") {
            return res.status(400).send("Datos no válidos: " + error.message)
        }
        if (error.code == 11000) {
            return res.status(409).send("Ya existe un registro con esos datos")
        }
        return res.status(500).send("Error interno")
    }
  }

  async getReservas(req, res){
    try {
        let filter = {}
        if (req.user.rol == "CLIENTE") {
            filter.cliente = req.user.id
        }
        if (req.query.fecha) {
            filter.fecha = req.query.fecha
        }
        if (req.query.estado) {
            filter.estado = req.query.estado
        }
        if (req.query.espacio) {
            filter.espacio = req.query.espacio
        }
        const result = await Reserva.find(filter)
            .populate("espacio", "nombre tipo")
            .populate("cliente", "nombre email")
            .sort({ fecha: 1, horaInicio: 1 });
        return res.status(200).send(result)
    } catch (error) {
        console.log(error);
        if (error.name == "CastError") {
            return res.status(400).send("Id no válido")
        }
        if (error.name == "ValidationError") {
            return res.status(400).send("Datos no válidos: " + error.message)
        }
        if (error.code == 11000) {
            return res.status(409).send("Ya existe un registro con esos datos")
        }
        return res.status(500).send("Error interno")
    }
  }

  async cancelarReserva(req, res){
    try {
        const reserva = await Reserva.findById(req.params.id);
        if (!reserva){
            return res.status(404).send("reserva no encontrada")
        }
        const esDueno = String(reserva.cliente) == req.user.id;
        if (!esDueno && req.user.rol != "ADMIN"){
            return res.status(403).send("No puedes cancelar esta reserva")
        }
        if (reserva.estado != "confirmada"){
            return res.status(400).send("La reserva ya está " + reserva.estado)
        }
        const ahora = ahoraEnMadrid();
        const yaEmpezo = reserva.fecha < ahora.fecha || (reserva.fecha == ahora.fecha && reserva.horaInicio <= ahora.hora);
        if (yaEmpezo && req.user.rol != "ADMIN"){
            return res.status(400).send("La reserva ya ha empezado")
        }
        reserva.estado = "cancelada";
        const result = await reserva.save();
        return res.status(200).send(result)
    } catch (error) {
        console.log(error);
        if (error.name == "CastError") {
            return res.status(400).send("Id no válido")
        }
        if (error.name == "ValidationError") {
            return res.status(400).send("Datos no válidos: " + error.message)
        }
        if (error.code == 11000) {
            return res.status(409).send("Ya existe un registro con esos datos")
        }
        return res.status(500).send("Error interno")
    }
  }
}

module.exports = new ReservaController();