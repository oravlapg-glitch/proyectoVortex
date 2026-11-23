const Producto = require("../model/producto.model");
const productos = require("../bbdd/productos");

// Escapa los caracteres especiales para que una búsqueda con "(" o "*" no rompa la consulta
const escaparTexto = (texto) => String(texto).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

class ProductoController {

  // Carga el merch de ejemplo (no se duplica)
  async cargaInicial(req, res){
    try {
        for (const producto of productos) {
          await Producto.updateOne({ nombre: producto.nombre }, { ...producto, activo: true }, { upsert: true });
        }
        return res.status(201).send("Carga de productos completa!");
    } catch (error) {
        console.log(error);
        // id mal escrito (ejemplo: /api/espacios/hola) → 400
        if (error.name == "CastError") {
            return res.status(400).send("Id no válido")
        }
        // datos que no cumplen el modelo (required, enum, min...) → 400
        if (error.name == "ValidationError") {
            return res.status(400).send("Datos no válidos: " + error.message)
        }
        // unique repetido (email, nombre...) → 409
        if (error.code == 11000) {
            return res.status(409).send("Ya existe un registro con esos datos")
        }
        // cualquier otro fallo → 500
        return res.status(500).send("Error interno")
    }
  }

  // Catálogo público. GET /api/productos?categoria=ropa&q=sudadera&maxPrecio=40
  async getProductos(req, res){
    try {
        let filter = { activo: true }
        if (req.query.categoria) {
            filter.categoria = req.query.categoria
        }
        if (req.query.q) {
            filter.nombre = { $regex: escaparTexto(req.query.q), $options: "i" }
        }
        if (req.query.maxPrecio) {
            filter.precio = { $lte: Number(req.query.maxPrecio) }
        }
        const result = await Producto.find(filter).sort({ nombre: 1 });
        return res.status(200).send(result)
    } catch (error) {
        console.log(error);
        // id mal escrito (ejemplo: /api/espacios/hola) → 400
        if (error.name == "CastError") {
            return res.status(400).send("Id no válido")
        }
        // datos que no cumplen el modelo (required, enum, min...) → 400
        if (error.name == "ValidationError") {
            return res.status(400).send("Datos no válidos: " + error.message)
        }
        // unique repetido (email, nombre...) → 409
        if (error.code == 11000) {
            return res.status(409).send("Ya existe un registro con esos datos")
        }
        // cualquier otro fallo → 500
        return res.status(500).send("Error interno")
    }
  }

  async getProductoById(req, res){
    try {
        const result = await Producto.findById(req.params.id);
        if (!result || !result.activo){
            return res.status(404).send("producto no encontrado")
        }
        return res.status(200).send(result)
    } catch (error) {
        console.log(error);
        // id mal escrito (ejemplo: /api/espacios/hola) → 400
        if (error.name == "CastError") {
            return res.status(400).send("Id no válido")
        }
        // datos que no cumplen el modelo (required, enum, min...) → 400
        if (error.name == "ValidationError") {
            return res.status(400).send("Datos no válidos: " + error.message)
        }
        // unique repetido (email, nombre...) → 409
        if (error.code == 11000) {
            return res.status(409).send("Ya existe un registro con esos datos")
        }
        // cualquier otro fallo → 500
        return res.status(500).send("Error interno")
    }
  }

  async createProducto(req, res){
    try {
        const result = await Producto.create(req.body);
        return res.status(201).send(result)
    } catch (error) {
        console.log(error);
        // id mal escrito (ejemplo: /api/espacios/hola) → 400
        if (error.name == "CastError") {
            return res.status(400).send("Id no válido")
        }
        // datos que no cumplen el modelo (required, enum, min...) → 400
        if (error.name == "ValidationError") {
            return res.status(400).send("Datos no válidos: " + error.message)
        }
        // unique repetido (email, nombre...) → 409
        if (error.code == 11000) {
            return res.status(409).send("Ya existe un registro con esos datos")
        }
        // cualquier otro fallo → 500
        return res.status(500).send("Error interno")
    }
  }

  async updateProducto(req, res){
    try {
        const result = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!result){
            return res.status(404).send("producto no encontrado")
        }
        return res.status(200).send(result)
    } catch (error) {
        console.log(error);
        // id mal escrito (ejemplo: /api/espacios/hola) → 400
        if (error.name == "CastError") {
            return res.status(400).send("Id no válido")
        }
        // datos que no cumplen el modelo (required, enum, min...) → 400
        if (error.name == "ValidationError") {
            return res.status(400).send("Datos no válidos: " + error.message)
        }
        // unique repetido (email, nombre...) → 409
        if (error.code == 11000) {
            return res.status(409).send("Ya existe un registro con esos datos")
        }
        // cualquier otro fallo → 500
        return res.status(500).send("Error interno")
    }
  }

  // Se desactiva en vez de borrar: hay pedidos que lo usan
  async deleteProducto(req, res){
    try {
        const result = await Producto.findByIdAndUpdate(req.params.id, { activo: false }, { new: true });
        if (!result){
            return res.status(404).send("producto no encontrado")
        }
        return res.status(200).send(result)
    } catch (error) {
        console.log(error);
        // id mal escrito (ejemplo: /api/espacios/hola) → 400
        if (error.name == "CastError") {
            return res.status(400).send("Id no válido")
        }
        // datos que no cumplen el modelo (required, enum, min...) → 400
        if (error.name == "ValidationError") {
            return res.status(400).send("Datos no válidos: " + error.message)
        }
        // unique repetido (email, nombre...) → 409
        if (error.code == 11000) {
            return res.status(409).send("Ya existe un registro con esos datos")
        }
        // cualquier otro fallo → 500
        return res.status(500).send("Error interno")
    }
  }
}

module.exports = new ProductoController();
