const express = require('express');
const ruta = express.Router();
const pedidoController = require('../controller/pedido.controller');
const { validarPedido } = require('../middleware/validar.middleware');
const { verificarToken, permitirRoles } = require("../middleware/auth.middleware")

// Todas empiezan por http://localhost:3000/api/pedidos y necesitan token

// Solo CLIENTE: hacer un pedido para recoger
// POST http://localhost:3000/api/pedidos
// Body: { "lineas": [ { "producto": "<id>", "cantidad": 1, "talla": "L" } ] }
/**
 * @swagger
 * /api/pedidos:
 *   post:
 *     tags:
 *     - Pedidos
 *     summary: Pedido para recoger en el local
 *     description: 'Requiere token. Roles: CLIENTE.'
 *     security:
 *     - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             lineas:
 *             - producto: <id>
 *               cantidad: 1
 *               talla: L
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
ruta.post("/", verificarToken, permitirRoles("CLIENTE"), validarPedido, pedidoController.createPedido);

// Cliente los suyos, personal todos
// GET http://localhost:3000/api/pedidos
/**
 * @swagger
 * /api/pedidos:
 *   get:
 *     tags:
 *     - Pedidos
 *     summary: 'Listar: cliente los suyos, personal todos'
 *     description: Requiere token.
 *     security:
 *     - bearerAuth: []
 *     parameters:
 *     - in: query
 *       name: estado
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
ruta.get("/", verificarToken, pedidoController.getPedidos);
// GET http://localhost:3000/api/pedidos/:id
/**
 * @swagger
 * /api/pedidos/{id}:
 *   get:
 *     tags:
 *     - Pedidos
 *     summary: Detalle de pedido
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
ruta.get("/:id", verificarToken, pedidoController.getPedidoById);

// Cambiar estado. Body: { "estado": "listo" }
// PATCH http://localhost:3000/api/pedidos/:id/estado
/**
 * @swagger
 * /api/pedidos/{id}/estado:
 *   patch:
 *     tags:
 *     - Pedidos
 *     summary: 'Cliente: cancelar. Personal: listo / recogido / cancelado'
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
 *             estado: listo
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
ruta.patch("/:id/estado", verificarToken, pedidoController.updateEstado);

module.exports = ruta;
