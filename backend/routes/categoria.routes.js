const express = require('express');
const ruta = express.Router();
const categoriaController = require('../controller/categoria.controller');
const { validarCategoria} = require('../middleware/validar.middleware');
const { verificarToken, permitirRoles} = require("../middleware/permisos.middleware")

ruta.get("/carga-inicial", verificarToken, permitirRoles("ADMIN"), categoriaController.cargaInicial);

ruta.get("/", verificarToken, categoriaController.getCategorias);

ruta.post("/", verificarToken, permitirRoles("ADMIN"), validarCategoria, categoriaController.createCategoria);

ruta.put("/:id", verificarToken, permitirRoles("ADMIN"), categoriaController.updateCategoria);

module.exports = ruta;