const express = require('express');
const ruta = express.Router();
const productoController = require('../controller/producto.controller');
const { validarProducto } = require('../middleware/validar.middleware');
const { verificarToken, permitirRoles } = require("../middleware/auth.middleware")

// Todas empiezan por http://localhost:3000/api/productos

// Solo ADMIN: carga el merch de ejemplo
// GET http://localhost:3000/api/productos/carga-inicial
/**
 * @swagger
 * /api/productos/carga-inicial:
 *   get:
 *     tags:
 *     - Productos
 *     summary: Carga el merch de ejemplo
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
ruta.get("/carga-inicial", verificarToken, permitirRoles("ADMIN"), productoController.cargaInicial);

// Público
// GET http://localhost:3000/api/productos?categoria=ropa
/**
 * @swagger
 * /api/productos:
 *   get:
 *     tags:
 *     - Productos
 *     summary: Catálogo de merch activo con filtros
 *     description: Pública (sin token).
 *     parameters:
 *     - in: query
 *       name: categoria
 *       required: false
 *       schema:
 *         type: string
 *     - in: query
 *       name: q
 *       required: false
 *       schema:
 *         type: string
 *     - in: query
 *       name: maxPrecio
 *       required: false
 *       schema:
 *         type: number
 *     responses:
 *       '200':
 *         description: OK
 *       '400':
 *         description: Datos no válidos
 */
ruta.get("/", productoController.getProductos);
// GET http://localhost:3000/api/productos/:id
/**
 * @swagger
 * /api/productos/{id}:
 *   get:
 *     tags:
 *     - Productos
 *     summary: Ficha de producto
 *     description: Pública (sin token).
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
 *       '404':
 *         description: No encontrado
 */
ruta.get("/:id", productoController.getProductoById);

// Solo ADMIN
// POST http://localhost:3000/api/productos
// Body: { "nombre": "Gorra Vortex", "categoria": "ropa", "precio": 15, "stock": 10 }
/**
 * @swagger
 * /api/productos:
 *   post:
 *     tags:
 *     - Productos
 *     summary: Crear producto
 *     description: 'Requiere token. Roles: ADMIN.'
 *     security:
 *     - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             nombre: Gorra Vortex
 *             categoria: ropa
 *             precio: 15
 *             stock: 10
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
ruta.post("/", verificarToken, permitirRoles("ADMIN"), validarProducto, productoController.createProducto);
// PUT http://localhost:3000/api/productos/:id   Body: { "stock": 25 }
/**
 * @swagger
 * /api/productos/{id}:
 *   put:
 *     tags:
 *     - Productos
 *     summary: Modificar producto
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
 *             stock: 25
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
ruta.put("/:id", verificarToken, permitirRoles("ADMIN"), productoController.updateProducto);
// DELETE http://localhost:3000/api/productos/:id
/**
 * @swagger
 * /api/productos/{id}:
 *   delete:
 *     tags:
 *     - Productos
 *     summary: Desactivar producto
 *     description: 'Requiere token. Roles: ADMIN.'
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
ruta.delete("/:id", verificarToken, permitirRoles("ADMIN"), productoController.deleteProducto);

module.exports = ruta;
