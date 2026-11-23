const express = require('express');
const ruta = express.Router();
const espacioController = require('../controller/espacio.controller');
const { validarEspacio } = require('../middleware/validar.middleware');
const { verificarToken, permitirRoles } = require("../middleware/auth.middleware")

// Todas empiezan por http://localhost:3000/api/espacios (definido en index.js)

// Solo ADMIN: carga los PCs y salas de ejemplo
// GET http://localhost:3000/api/espacios/carga-inicial
/**
 * @swagger
 * /api/espacios/carga-inicial:
 *   get:
 *     tags:
 *     - Espacios
 *     summary: Carga los PCs y salas de ejemplo
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
ruta.get("/carga-inicial", verificarToken, permitirRoles("ADMIN"), espacioController.cargaInicial);

// Solo ADMIN: todos los espacios, también los desactivados
// GET http://localhost:3000/api/espacios/todos
/**
 * @swagger
 * /api/espacios/todos:
 *   get:
 *     tags:
 *     - Espacios
 *     summary: Todos los espacios, también los desactivados
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
ruta.get("/todos", verificarToken, permitirRoles("ADMIN"), espacioController.getTodos);

// Público: catálogo con filtros
// GET http://localhost:3000/api/espacios?tipo=sala&ord=desc
/**
 * @swagger
 * /api/espacios:
 *   get:
 *     tags:
 *     - Espacios
 *     summary: Catálogo de PCs y salas activos, con filtros y paginación
 *     description: Pública (sin token).
 *     parameters:
 *     - in: query
 *       name: tipo
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
 *     - in: query
 *       name: minCapacidad
 *       required: false
 *       schema:
 *         type: number
 *     - in: query
 *       name: ord
 *       required: false
 *       schema:
 *         type: string
 *     - in: query
 *       name: page
 *       required: false
 *       schema:
 *         type: integer
 *     - in: query
 *       name: limit
 *       required: false
 *       schema:
 *         type: integer
 *     responses:
 *       '200':
 *         description: OK
 *       '400':
 *         description: Datos no válidos
 */
ruta.get("/", espacioController.getEspacios);

// Público: ficha de un espacio (va DESPUÉS de las rutas fijas)
// GET http://localhost:3000/api/espacios/:id
/**
 * @swagger
 * /api/espacios/{id}:
 *   get:
 *     tags:
 *     - Espacios
 *     summary: Ficha de un espacio
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
ruta.get("/:id", espacioController.getEspacioById);

// Solo ADMIN: crear
// POST http://localhost:3000/api/espacios
// Body: { "nombre": "PC 05", "tipo": "pc", "capacidad": 1, "precioHora": 3 }
/**
 * @swagger
 * /api/espacios:
 *   post:
 *     tags:
 *     - Espacios
 *     summary: Crear un espacio
 *     description: 'Requiere token. Roles: ADMIN.'
 *     security:
 *     - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             nombre: PC 05
 *             tipo: pc
 *             capacidad: 1
 *             precioHora: 3
 *             specs:
 *             - RTX 4070
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
ruta.post("/", verificarToken, permitirRoles("ADMIN"), validarEspacio, espacioController.createEspacio);

// Solo ADMIN: modificar. Body: { "precioHora": 3.5 }
// PUT http://localhost:3000/api/espacios/:id
/**
 * @swagger
 * /api/espacios/{id}:
 *   put:
 *     tags:
 *     - Espacios
 *     summary: Modificar un espacio
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
 *             precioHora: 3.5
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
ruta.put("/:id", verificarToken, permitirRoles("ADMIN"), espacioController.updateEspacio);

// Solo ADMIN: desactivar
// DELETE http://localhost:3000/api/espacios/:id
/**
 * @swagger
 * /api/espacios/{id}:
 *   delete:
 *     tags:
 *     - Espacios
 *     summary: Desactivar un espacio (borrado lógico)
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
ruta.delete("/:id", verificarToken, permitirRoles("ADMIN"), espacioController.deleteEspacio);

module.exports = ruta;
