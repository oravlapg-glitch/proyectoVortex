const express = require('express');
const ruta = express.Router();
const usuarioController = require('../controller/usuario.controller');
const {validarSignup, validarLogin} = require('../middleware/validar.middleware');
const { verificarToken, permitirRoles } = require("../middleware/permisos.middleware")

ruta.post("/signup", validarSignup, usuarioController.signUp);

ruta.post("/login", validarLogin, usuarioController.logIn);

ruta.get("/me", verificarToken, usuarioController.getMe);
ruta.put("/me", verificarToken, usuarioController.updateMe);
ruta.get("/", verificarToken, permitirRoles("ADMIN"), usuarioController.getUsers);
ruta.patch("/:id/rol", verificarToken, permitirRoles("ADMIN"), usuarioController.cambiarRol);

ruta.get("/carga-inicial", usuarioController.cargaInicial) // ruta para cargar usuarios

module.exports = ruta;