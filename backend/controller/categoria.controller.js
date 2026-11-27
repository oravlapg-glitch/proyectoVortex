const Categoria = require("../model/categoria.model");
const categorias = require("../bbdd/categorias");

class CategoriaController {
    async cargaInicial(req, res){
        try{
            for (const categoria of categorias){
                await Categoria.updateOne({ nombre: categoria.nombre}, {...categoria, activa: true}, {upsert: true});
            }
            return res.status(201).send("Carga de categorias completa");
        }catch (error){
            console.log(error);
            if (error.name == "CastError"){
                return res.status(400).send("Id no valido")
            }
            if (error.name == "ValidationError"){
                return res.status(400).send("Datos no validos: "+ error.message)
            }
            if (error.code == 11000){
                return res.status(409).send("Ya existe un registro con esos datos")
            }
            return res.status(500).send("Error interno")
        }
    }
    async getCategorias(req, res){
        try{
            let filter = {}
            if (req.user.rol != "ADMIN"){
                filter.activa = true
            }
            const result = await Categoria.find(filter).sort({nombre: 1});
            return res.status(200).send(result)
        }catch (error){
            console.log(error);
            if (error.name == "CastError"){
                return res.status(400).send("Id no valido")
            }
            if (error.name == "ValidationError"){
                return res.status(400).send("Datos no validos: "+ error.message)
            }
            if (error.code == 11000){
                return res.status(409).send("Ya existe un registro con esos datos")
            }
            return res.status(500).send("Error interno")
        }
    }
    async createCategoria(req, res){
        try{
            const result = await Categoria.create(req.body);
            return res.status(201).send(result);
        }catch (error){
            console.log(error);
            if (error.name == "CastError"){
                return res.status(400).send("Id no valido")
            }
            if (error.name == "ValidationError"){
                return res.status(400).send("Datos no validos: "+ error.message)
            }
            if (error.code == 11000){
                return res.status(409).send("Ya existe un registro con esos datos")
            }
            return res.status(500).send("Error interno")
        }
    }
    async updateCategoria(req, res){
        try{
            const result = await Categoria.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
            if (!result){
                return res.status(404).send("Categoria no encontrada")
            }
            return res.status(200).send(result)
        }catch (error){
            console.log(error);
            if (error.name == "CastError"){
                return res.status(400).send("Id no valido")
            }
            if (error.name == "ValidationError"){
                return res.status(400).send("Datos no validos: "+ error.message)
            }
            if (error.code == 11000){
                return res.status(409).send("Ya existe un registro con esos datos")
            }
            return res.status(500).send("Error interno")
        }
    }
}
module.exports = new CategoriaController();