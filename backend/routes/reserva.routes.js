const express = require('express');
const ruta = express.Router();
const reservaController = require('../controller/reserva.controller');
const { validarReserva } = require('../middleware/validar.middleware');
const { verificarToken, permitirRoles } = require("../middleware/auth.middleware")

// Todas empiezan por http://localhost:3000/api/reservas

// Público: franjas libres de un espacio en un día
// GET http://localhost:3000/api/reservas/disponibilidad?espacio=<id>&fecha=2026-12-05
/**
 * @swagger
 * /api/reservas/disponibilidad:
 *   get:
 *     tags:
 *     - Reservas
 *     summary: Franjas libres/ocupadas de un espacio en un día
 *     description: Pública (sin token).
 *     parameters:
 *     - in: query
 *       name: espacio
 *       required: false
 *       schema:
 *         type: string
 *     - in: query
 *       name: fecha
 *       required: false
 *       schema:
 *         type: string
 *     responses:
 *       '200':
 *         description: OK
 *       '400':
 *         description: Datos no válidos
 */
ruta.get("/disponibilidad", reservaController.getDisponibilidad);

// Solo CLIENTE: reservar
// POST http://localhost:3000/api/reservas
// Body: { "espacio": "<id>", "fecha": "2026-12-05", "horaInicio": 18, "horas": 2 }
/**
 * @swagger
 * /api/reservas:
 *   post:
 *     tags:
 *     - Reservas
 *     summary: Reservar un espacio (1–4 horas, sin solapes)
 *     description: 'Requiere token. Roles: CLIENTE.'
 *     security:
 *     - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             espacio: <id>
 *             fecha: '2026-12-05'
 *             horaInicio: 18
 *             horas: 2
 *     responses:
 *       '201':
 *         description: Creado
 *       '400':
 *         description: Datos no válidos
 *       '401':
 *         description: Sin token o token inválido
 *       '403':
 *         description: Sin permiso
 */
ruta.post("/", verificarToken, permitirRoles("CLIENTE"), validarReserva, reservaController.createReserva);

// Con sesión: cliente las suyas, personal todas
// GET http://localhost:3000/api/reservas
/**
 * @swagger
 * /api/reservas:
 *   get:
 *     tags:
 *     - Reservas
 *     summary: 'Listar: cliente las suyas, personal todas'
 *     description: Requiere token.
 *     security:
 *     - bearerAuth: []
 *     parameters:
 *     - in: query
 *       name: fecha
 *       required: false
 *       schema:
 *         type: string
 *     - in: query
 *       name: estado
 *       required: false
 *       schema:
 *         type: string
 *     - in: query
 *       name: espacio
 *       required: false
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
 */
ruta.get("/", verificarToken, reservaController.getReservas);

// Cancelar (dueño o ADMIN)
// PATCH http://localhost:3000/api/reservas/:id/cancelar
/**
 * @swagger
 * /api/reservas/{id}/cancelar:
 *   patch:
 *     tags:
 *     - Reservas
 *     summary: Cancelar una reserva (dueño o admin)
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
ruta.patch("/:id/cancelar", verificarToken, reservaController.cancelarReserva);

module.exports = ruta;
