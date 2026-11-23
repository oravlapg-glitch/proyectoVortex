const Espacio = require("../model/espacio.model");
const espacios = require("../bbdd/espacios");

// Escapa los caracteres especiales para que una búsqueda con "(" o "*" no rompa la consulta
const escaparTexto = (texto) => String(texto).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

class EspacioController {

  // Carga los PCs y salas de ejemplo (si ya existen los actualiza: no se duplican)
  async cargaInicial(req, res){
    try {
        for (const espacio of espacios) {
          await Espacio.updateOne({ nombre: espacio.nombre }, { ...espacio, activo: true }, { upsert: true });
        }
        return res.status(201).send("Carga de espacios completa!");
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

  // Catálogo público con filtros, orden y paginación (solo los activos)
  // GET /api/espacios?tipo=pc&q=rtx&maxPrecio=5&minCapacidad=2&ord=desc&page=1&limit=10
  async getEspacios(req, res){
    try {
        let filter = { activo: true }
        if (req.query.tipo) {
            filter.tipo = req.query.tipo
        }
        if (req.query.q) {
            // $regex con $options "i" → contiene el texto, sin importar mayúsculas
            filter.nombre = { $regex: escaparTexto(req.query.q), $options: "i" }
        }
        if (req.query.maxPrecio) {
            filter.precioHora = { $lte: Number(req.query.maxPrecio) }
        }
        if (req.query.minCapacidad) {
            filter.capacidad = { $gte: Number(req.query.minCapacidad) }
        }

        // Orden por precio: ?ord=asc (por defecto) o ?ord=desc
        let orden = 1;
        if (req.query.ord == "desc") {
            orden = -1
        }

        // Paginación igual que en ventas: page y limit
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const result = await Espacio.find(filter).sort({ precioHora: orden, nombre: 1 }).skip(skip).limit(limit);
        const total = await Espacio.countDocuments(filter);

        return res.status(200).send({ datos: result, total: total, page: page, paginas: Math.ceil(total / limit) })
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

  // Ficha de un espacio (público)
  async getEspacioById(req, res){
    try {
        const result = await Espacio.findById(req.params.id);
        if (!result || !result.activo){
            return res.status(404).send("espacio no encontrado")
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

  // Todos, también los desactivados (solo ADMIN)
  async getTodos(req, res){
    try {
        const result = await Espacio.find().sort({ nombre: 1 });
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

  // Crear (solo ADMIN)
  async createEspacio(req, res){
    try {
        const result = await Espacio.create(req.body);
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

  // Modificar (solo ADMIN). En el body solo van los campos a cambiar
  async updateEspacio(req, res){
    try {
        // new: true → devuelve el espacio ya cambiado; runValidators: true → comprueba min, enum...
        const result = await Espacio.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!result){
            return res.status(404).send("espacio no encontrado")
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

  // "Eliminar" (solo ADMIN): se DESACTIVA porque puede tener reservas que lo usan
  async deleteEspacio(req, res){
    try {
        const result = await Espacio.findByIdAndUpdate(req.params.id, { activo: false }, { new: true });
        if (!result){
            return res.status(404).send("espacio no encontrado")
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

module.exports = new EspacioController();
