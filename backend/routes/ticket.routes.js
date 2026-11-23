const express = require('express');
const ruta = express.Router();
const ticketController = require('../controller/ticket.controller');
const { validarTicket, validarMensaje } = require('../middleware/validar.middleware');
const { verificarToken, permitirRoles } = require("../middleware/auth.middleware")

// Todas empiezan por http://localhost:3000/api/tickets
// TODAS necesitan token → Cabecera: Authorization: Bearer <token del login>

// CLIENTE o ADMIN: abrir ticket
// POST http://localhost:3000/api/tickets
// Body: { "asunto": "El PC 03 no arranca", "descripcion": "No enciende", "categoria": "<id>" }
/**
 * @swagger
 * /api/tickets:
 *   post:
 *     tags:
 *     - Tickets
 *     summary: Abrir ticket (pedido opcional para reclamaciones)
 *     description: 'Requiere token. Roles: CLIENTE, ADMIN.'
 *     security:
 *     - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             asunto: El PC 03 no arranca
 *             descripcion: No enciende
 *             categoria: <id>
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
ruta.post("/", verificarToken, permitirRoles("CLIENTE", "ADMIN"), validarTicket, ticketController.createTicket);

// Cualquiera con sesión: cada uno ve lo suyo
// GET http://localhost:3000/api/tickets?estado=abierto
/**
 * @swagger
 * /api/tickets:
 *   get:
 *     tags:
 *     - Tickets
 *     summary: 'Listar: cliente los suyos, agente los asignados, admin todos'
 *     description: Requiere token.
 *     security:
 *     - bearerAuth: []
 *     parameters:
 *     - in: query
 *       name: estado
 *       required: false
 *       schema:
 *         type: string
 *     - in: query
 *       name: prioridad
 *       required: false
 *       schema:
 *         type: string
 *     - in: query
 *       name: cliente
 *       required: false
 *       schema:
 *         type: string
 *     - in: query
 *       name: agente
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
ruta.get("/", verificarToken, ticketController.getTickets);

// Solo ADMIN: métricas (va ANTES de "/:id")
// GET http://localhost:3000/api/tickets/metricas
/**
 * @swagger
 * /api/tickets/metricas:
 *   get:
 *     tags:
 *     - Tickets
 *     summary: 'Métricas: total, por estado y sin asignar'
 *     description: 'Requiere token. Roles: ADMIN.'
 *     security:
 *     - bearerAuth: []
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
ruta.get("/metricas", verificarToken, permitirRoles("ADMIN"), ticketController.getMetricas);

// Detalle (solo si tienes acceso a ese ticket)
// GET http://localhost:3000/api/tickets/:id
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

// Responder. Body: { "texto": "..." }
// POST http://localhost:3000/api/tickets/:id/mensajes
/**
 * @swagger
 * /api/tickets/{id}/mensajes:
 *   post:
 *     tags:
 *     - Tickets
 *     summary: Responder en el ticket
 *     description: Requiere token.
 *     security:
 *     - bearerAuth: []
 *     parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             texto: ¿Te sale el icono de red con una X?
 *     responses:
 *       '201':
 *         description: Creado
 *       '400':
 *         description: Datos no válidos
 *       '401':
 *         description: Sin token o token inválido
 *       '403':
 *         description: Sin permiso
 *       '404':
 *         description: No encontrado
 */
ruta.post("/:id/mensajes", verificarToken, validarMensaje, ticketController.addMensaje);

// Cambiar estado. Body: { "estado": "en_curso" }
// PATCH http://localhost:3000/api/tickets/:id/estado
/**
 * @swagger
 * /api/tickets/{id}/estado:
 *   patch:
 *     tags:
 *     - Tickets
 *     summary: Cambiar estado según las reglas del rol
 *     description: Requiere token.
 *     security:
 *     - bearerAuth: []
 *     parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             estado: en_curso
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
ruta.patch("/:id/estado", verificarToken, ticketController.updateEstado);

// AGENTE o ADMIN: cambiar prioridad. Body: { "prioridad": "alta" }
// PATCH http://localhost:3000/api/tickets/:id/prioridad
/**
 * @swagger
 * /api/tickets/{id}/prioridad:
 *   patch:
 *     tags:
 *     - Tickets
 *     summary: Cambiar prioridad
 *     description: 'Requiere token. Roles: AGENTE, ADMIN.'
 *     security:
 *     - bearerAuth: []
 *     parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             prioridad: alta
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
ruta.patch("/:id/prioridad", verificarToken, permitirRoles("AGENTE", "ADMIN"), ticketController.updatePrioridad);

// Solo ADMIN: asignar a un agente. Body: { "agente": "<id>" }
// PATCH http://localhost:3000/api/tickets/:id/asignar
/**
 * @swagger
 * /api/tickets/{id}/asignar:
 *   patch:
 *     tags:
 *     - Tickets
 *     summary: Asignar o reasignar a un agente
 *     description: 'Requiere token. Roles: ADMIN.'
 *     security:
 *     - bearerAuth: []
 *     parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             agente: <id>
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
ruta.patch("/:id/asignar", verificarToken, permitirRoles("ADMIN"), ticketController.asignarAgente);

module.exports = ruta;
