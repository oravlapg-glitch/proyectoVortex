const express = require('express');
const ruta = express.Router();
const pedidoController = require('../controller/pedido.controller');
const { validarPedido } = require('../middleware/validar.middleware');
const { verificarToken, permitirRoles } = require("../middleware/permisos.middleware")

ruta.post("/", verificarToken, permitirRoles("CLIENTE"), validarPedido, pedidoController.createPedido);

ruta.get("/", verificarToken, pedidoController.getPedidos);
ruta.get("/:id", verificarToken, pedidoController.getPedidoById);

ruta.patch("/:id/estado", verificarToken, pedidoController.updateEstado);

module.exports = ruta;