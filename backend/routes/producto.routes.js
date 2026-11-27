const express = require('express');
const ruta = express.Router();
const productoController = require('../controller/producto.controller');
const { validarProducto } = require('../middleware/validar.middleware');
const { verificarToken, permitirRoles } = require("../middleware/permisos.middleware")

ruta.get("/carga-inicial", verificarToken, permitirRoles("ADMIN"), productoController.cargaInicial);

ruta.get("/", productoController.getProductos);
ruta.get("/:id", productoController.getProductoById);

ruta.post("/", verificarToken, permitirRoles("ADMIN"), validarProducto, productoController.createProducto);
ruta.put("/:id", verificarToken, permitirRoles("ADMIN"), productoController.updateProducto);
ruta.delete("/:id", verificarToken, permitirRoles("ADMIN"), productoController.deleteProducto);

module.exports = ruta;