const express = require('express');
const ruta = express.Router();
const usuarioController = require('../controller/usuario.controller');
const { validarSignup, validarLogin } = require('../middleware/validar.middleware');
const { verificarToken, permitirRoles } = require("../middleware/auth.middleware")

// Todas empiezan por http://localhost:3000/api/usuarios (definido en index.js)

// Carga los usuarios de prueba con la contraseña encriptada
// GET http://localhost:3000/api/usuarios/carga-inicial
// IMPORTANTE: las rutas fijas van ANTES de "/:id", si no Express pensaría que "carga-inicial" es un id
/**
 * @swagger
 * /api/usuarios/carga-inicial:
 *   get:
 *     tags:
 *     - Usuarios
 *     summary: Carga los usuarios de prueba (no se duplican)
 *     description: Pública (sin token).
 *     responses:
 *       '200':
 *         description: OK
 *       '400':
 *         description: Datos no válidos
 */
ruta.get("/carga-inicial", usuarioController.cargaInicial);

// POST http://localhost:3000/api/usuarios/signup
// Body: { "nombre": "Ana", "email": "ana@gmail.com", "password": "123456" }
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
 */
ruta.post("/signup", validarSignup, usuarioController.signUp);

// POST http://localhost:3000/api/usuarios/login
// Body: { "email": "ana@vortex.test", "password": "Cliente123!" }
/**
 * @swagger
 * /api/usuarios/login:
 *   post:
 *     tags:
 *     - Usuarios
 *     summary: 'Login: devuelve el token JWT'
 *     description: Pública (sin token).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: ana@vortex.test
 *             password: Cliente123!
 *     responses:
 *       '201':
 *         description: Creado
 *       '400':
 *         description: Datos no válidos
 */
ruta.post("/login", validarLogin, usuarioController.logIn);

// Mis datos. Cabecera: Authorization: Bearer <token del login>
// GET http://localhost:3000/api/usuarios/me
/**
 * @swagger
 * /api/usuarios/me:
 *   get:
 *     tags:
 *     - Usuarios
 *     summary: Mis datos
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
ruta.get("/me", verificarToken, usuarioController.getMe);

// Editar mis datos. Body: { "nombre": "Ana López" }
// PUT http://localhost:3000/api/usuarios/me
/**
 * @swagger
 * /api/usuarios/me:
 *   put:
 *     tags:
 *     - Usuarios
 *     summary: Editar mis datos (nombre, email, password)
 *     description: Requiere token.
 *     security:
 *     - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             nombre: Ana López
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
ruta.put("/me", verificarToken, usuarioController.updateMe);

// Solo ADMIN: lista de usuarios (filtro opcional ?rol=AGENTE)
// GET http://localhost:3000/api/usuarios
/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     tags:
 *     - Usuarios
 *     summary: Listar usuarios (filtro opcional por rol)
 *     description: 'Requiere token. Roles: ADMIN.'
 *     security:
 *     - bearerAuth: []
 *     parameters:
 *     - in: query
 *       name: rol
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
ruta.get("/", verificarToken, permitirRoles("ADMIN"), usuarioController.getUsers);

// Solo ADMIN: cambiar rol. Body: { "rol": "AGENTE" }
// PATCH http://localhost:3000/api/usuarios/:id/rol
/**
 * @swagger
 * /api/usuarios/{id}/rol:
 *   patch:
 *     tags:
 *     - Usuarios
 *     summary: Cambiar el rol de un usuario
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
 *             rol: AGENTE
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
ruta.patch("/:id/rol", verificarToken, permitirRoles("ADMIN"), usuarioController.cambiarRol);

// Solo ADMIN: activar/desactivar. Body: { "activo": false }
// PATCH http://localhost:3000/api/usuarios/:id/activo
/**
 * @swagger
 * /api/usuarios/{id}/activo:
 *   patch:
 *     tags:
 *     - Usuarios
 *     summary: Activar o desactivar un usuario
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
 *             activo: false
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
ruta.patch("/:id/activo", verificarToken, permitirRoles("ADMIN"), usuarioController.cambiarActivo);

// Exporta el Router para que index.js lo use con app.use("/api/usuarios", rutaUsuarios)
module.exports = ruta;
