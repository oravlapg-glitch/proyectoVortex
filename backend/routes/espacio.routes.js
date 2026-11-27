const express = require('express');
const ruta = express.Router();
const espacioController = require('../controller/espacio.controller');
const { validarEspacio } = require('../middleware/validar.middleware');
const { verificarToken, permitirRoles } = require("../middleware/permisos.middleware")

ruta.get("/carga-inicial", verificarToken, permitirRoles("ADMIN"), espacioController.cargaInicial);

ruta.get("/todos", verificarToken, permitirRoles("ADMIN"), espacioController.getTodos);

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
 *       schema:
 *         type: string
 *       description: pc o sala
 *     - in: query
 *       name: ord
 *       schema:
 *         type: string
 *       description: asc o desc (por precio)
 *     - in: query
 *       name: page
 *       schema:
 *         type: integer
 *     responses:
 *       '200':
 *         description: Lista de espacios
 */
ruta.get("/", espacioController.getEspacios);

ruta.get("/:id", espacioController.getEspacioById);

ruta.post("/", verificarToken, permitirRoles("ADMIN"), validarEspacio, espacioController.createEspacio);

ruta.put("/:id", verificarToken, permitirRoles("ADMIN"), espacioController.updateEspacio);

ruta.delete("/:id", verificarToken, permitirRoles("ADMIN"), espacioController.deleteEspacio);

module.exports = ruta;