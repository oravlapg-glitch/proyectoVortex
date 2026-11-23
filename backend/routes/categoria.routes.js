const express = require('express');
const ruta = express.Router();
const categoriaController = require('../controller/categoria.controller');
const { validarCategoria } = require('../middleware/validar.middleware');
const { verificarToken, permitirRoles } = require("../middleware/auth.middleware")

// Todas empiezan por http://localhost:3000/api/categorias

// Solo ADMIN: carga las categorías de ejemplo
// GET http://localhost:3000/api/categorias/carga-inicial
/**
 * @swagger
 * /api/categorias/carga-inicial:
 *   get:
 *     tags:
 *     - Categorías
 *     summary: Carga las categorías de ejemplo
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
ruta.get("/carga-inicial", verificarToken, permitirRoles("ADMIN"), categoriaController.cargaInicial);

// Cualquier usuario con sesión
// GET http://localhost:3000/api/categorias
/**
 * @swagger
 * /api/categorias:
 *   get:
 *     tags:
 *     - Categorías
 *     summary: Categorías de ticket
 *     description: Requiere token.
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
ruta.get("/", verificarToken, categoriaController.getCategorias);

// Solo ADMIN: crear. Body: { "nombre": "Torneos", "prioridadPorDefecto": "media" }
// POST http://localhost:3000/api/categorias
/**
 * @swagger
 * /api/categorias:
 *   post:
 *     tags:
 *     - Categorías
 *     summary: Crear categoría
 *     description: 'Requiere token. Roles: ADMIN.'
 *     security:
 *     - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             nombre: Torneos
 *             prioridadPorDefecto: media
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
ruta.post("/", verificarToken, permitirRoles("ADMIN"), validarCategoria, categoriaController.createCategoria);

// Solo ADMIN: modificar o desactivar. Body: { "activa": false }
// PUT http://localhost:3000/api/categorias/:id
/**
 * @swagger
 * /api/categorias/{id}:
 *   put:
 *     tags:
 *     - Categorías
 *     summary: Modificar o desactivar categoría
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
 *             activa: false
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
ruta.put("/:id", verificarToken, permitirRoles("ADMIN"), categoriaController.updateCategoria);

module.exports = ruta;
