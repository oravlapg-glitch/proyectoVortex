const express = require('express');
const ruta = express.Router();
const usuarioController = require('../controller/usuario.controller');
const {validarSignup, validarLogin} = require('../middleware/validar.middleware');
const { verificarToken, permitirRoles } = require("../middleware/permisos.middleware")

/**
 * @swagger
 * /api/usuarios/signup:
 *   post:
 *     tags:
 *     - Usuarios
 *     summary: 'Registro: crea SIEMPRE un usuario CLIENTE'
 *     description: Pública (sin token).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             nombre: Ana
 *             email: ana@ejemplo.com
 *             password: secreta123
 *     responses:
 *       '201':
 *         description: Creado
 *       '400':
 *         description: Datos no válidos
 *       '409':
 *         description: Email ya registrado
 */
ruta.post("/signup", validarSignup, usuarioController.signUp);

ruta.post("/login", validarLogin, usuarioController.logIn);

ruta.get("/me", verificarToken, usuarioController.getMe);
ruta.put("/me", verificarToken, usuarioController.updateMe);
ruta.get("/", verificarToken, permitirRoles("ADMIN"), usuarioController.getUsers);
ruta.patch("/:id/rol", verificarToken, permitirRoles("ADMIN"), usuarioController.cambiarRol);

ruta.get("/carga-inicial", usuarioController.cargaInicial) // ruta para cargar usuarios

module.exports = ruta;