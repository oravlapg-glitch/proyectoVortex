const express = require('express');
const ruta = express.Router();
const ticketController = require('../controller/ticket.controller');
const { validarTicket, validarMensaje } = require('../middleware/validar.middleware');
const { verificarToken, permitirRoles} = require("../middleware/permisos.middleware")

ruta.post("/", verificarToken, permitirRoles("CLIENTE","ADMIN"), validarTicket, ticketController.createTicket);
ruta.get("/", verificarToken, ticketController.getTickets);
ruta.get("/metricas", verificarToken, permitirRoles("ADMIN"), ticketController.getMetricas);
/**
 * @swagger
 * /api/tickets/{id}:
 *   get:
 *     tags:
 *     - Tickets
 *     summary: Detalle con mensajes e historial (solo si tienes acceso)
 *     description: Requiere token.
 *     security:
 *     - bearerAuth: []
 *     parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *     responses:
 *       '200':
 *         description: OK
 *       '400':
 *         description: Datos no válidos
 *       '401':
 *         description: Sin token o token inválido
 *       '403':
 *         description: Sin permiso
 *       '404':
 *         description: No encontrado
 */
ruta.get("/:id", verificarToken, ticketController.getTicketById);
ruta.post("/:id/mensajes", verificarToken, validarMensaje, ticketController.addMensaje);

ruta.patch("/:id/estado", verificarToken, ticketController.updateEstado);
ruta.patch("/:id/prioridad", verificarToken, permitirRoles("AGENTE", "ADMIN"), ticketController.updatePrioridad);
ruta.patch("/:id/asignar", verificarToken, permitirRoles("ADMIN"), ticketController.asignarAgente);

module.exports = ruta;