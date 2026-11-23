const Categoria = require("../model/categoria.model");
const categorias = require("../bbdd/categorias");

class CategoriaController {

  // Carga las categorías de ejemplo (no se duplican)
  async cargaInicial(req, res){
    try {
        for (const categoria of categorias) {
          await Categoria.updateOne({ nombre: categoria.nombre }, { ...categoria, activa: true }, { upsert: true });
        }
        return res.status(201).send("Carga de categorías completa!");
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

  // Lista: el ADMIN ve todas; los demás solo las activas (las necesita el formulario de ticket)
  async getCategorias(req, res){
    try {
        let filter = {}
        if (req.user.rol != "ADMIN") {
            filter.activa = true
        }
        const result = await Categoria.find(filter).sort({ nombre: 1 });
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
  async createCategoria(req, res){
    try {
        const result = await Categoria.create(req.body);
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

  // Modificar o desactivar (solo ADMIN). Body: { "activa": false }
  async updateCategoria(req, res){
    try {
        const result = await Categoria.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!result){
            return res.status(404).send("categoría no encontrada")
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

module.exports = new CategoriaController();
