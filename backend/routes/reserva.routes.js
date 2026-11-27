const express = require('express');
const ruta = express.Router();
const reservaController = require('../controller/reserva.controller');
const { validarReserva } = require('../middleware/validar.middleware');
const { verificarToken, permitirRoles } = require("../middleware/permisos.middleware")

ruta.get("/disponibilidad", reservaController.getDisponibilidad);

ruta.post("/", verificarToken, permitirRoles("CLIENTE"), validarReserva, reservaController.createReserva);

ruta.get("/", verificarToken, reservaController.getReservas);

ruta.patch("/:id/cancelar", verificarToken, reservaController.cancelarReserva);

module.exports = ruta;