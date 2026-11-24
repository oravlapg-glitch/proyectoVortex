const Espacio = require("../model/espacio.model");
const espacios = require("../bbdd/espacios");

const  escaparTexto = (texto) => String(texto).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

class EspacioController {
    async cargaInicial(req, res){
        try{
            for (const espacio of espacios){
                await Espacio.updateOne({nombre: espacio.nombre}, { ...espacio, activo: true}, {upsert: true});
            }
            return res.status(201).send("Carga de espacios completa");
        }catch (error) {
            console.log(error);
            if (error.name == "CastError") {
                return res.status(400).send("Id no valido")
            }
            if (error.name  == "ValidationError") {
                return res.status(400).send("Datos no validos: "+ error.message)
            }
            if (error.code == 11000) {
                return res.status(409).send("ya existe un registro")
            }
            return res.status(500).send(" Error interno")
        }
    }
    async getEspacios(req, res){
        try {
            let filter = {activo: true}
            if (req.query.tipo){
                filter.tipo = req.query.tipo
            }
            if (req.query.q){
                filter.nombre = { $regex: escaparTexto(req.query.q), $options: "i"}
            }
            if (req.query.maxPrecio){
                filter.precioHora = { $lte: Number(req.query.maxPrecio)}
            }
            if (req.query.minCapacidad){
                filter.capacidad = {$gte: Number(req.query.minCapacidad)}
            }

            let orden = 1;
            if (req.query.ord == "desc") {
                orden = -1;
            }

            const page = Number(req.query.page)|| 1;
            const limit = Number(req.query.limit)|| 10;
            const skip = (page - 1) * limit;

            const result = await Espacio.find(filter).sort({precioHora: orden, nombre: 1}).skip(skip).limit(limit);
            const total = await Espacio.countDocuments(filter);
            return res.status(200).send({ datos: result, total: total, page: page, paginas: Math.ceil(total / limit)})
        }catch (error) {
            console.log(error);
            if (error.name == "CastError"){
                return res.status(400).send("Id no valido")
            }
            if (error.name == "ValidationError"){
                return res.status(400).send("Datos no validos: "+ error.message)
            }
            if (error.code == 11000){
                return res.status(409).send("ya existe un registro")
            }
            return res.status(500).send("Error interno")
        }
    }
    async getEspacioById(req, res){
        try{
            const result = await Espacio.findById(req.params.id);
            if (!result || !result.activo){
                return res.status(404).send("Espacio no encontrado")
            }
            return res.status(200).send(result)
        }catch (error) {
            console.log(error);
            if (error.name == "CastError"){
                return res.status(400).send("Id no valido")
            }
            if (error.name == "ValidationError"){
                return res.status(400).send("Datos no validos: "+error.message)
            }
            if (error.code == 11000){
                return res.status(409).send("Ya existe un registro")
            }
            return res.status(500).send("Error interno")
        }
    }


    async getTodos(req, res){
        try{
            const result = await Espacio.find().sort({nombre: 1});
            return res.status(200).send(result)
        }catch (error) {
            console.log(error);
                if (error.name == "CastError"){
                    return res.status(400).send("Id no valido")
                }
                if (error.name == "ValidationError"){
                    return res.status(400).send("Datos no validos: "+error.message)
                }
                if (error.code == 11000){
                    return res.status(409).send("Ya existe un registro")
                }
                return res.status(500).send("Error interno")
        }
    }
    async createEspacio(req, res){
        try{
            const result = await Espacio.create(req.body);
            return res.status(201).send(result)
        }catch (error){
            console.log(error);
            if (error.name == "CastError"){
                return res.status(400).send("Id no valido")
            }
            if (error.name == "ValidationError"){
                return res.status(400).send("Datos no validos: "+error.message)
            }
            if (error.code == 11000){
                return res.status(409).send("Ya existe un registro")
            }
            return res.status(500).send("Error Interno")
        }
    }
    async updateEspacio(req,res){
        try{
            const result = await Espacio.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
            if (!result){
                return res.status(404).send("Espacio no encontrado")
            }
            return res.status(200).send(result)
        }catch (error){
            console.log(error);
            if (error.name == "CastError"){
                return res.status(400).send("Id no valido")
            }
            if (error.name == "ValidationError"){
                return res.status(400).send("Datos no validos: "+error.message)
            }
            if (error.code == 11000){
                return res.status(409).send("Ya existe un registro")
            }
            return res.status(500).send("Error Interno")
        }
    }
    async deleteEspacio(req, res){
        try{
            const result = await Espacio.findByIdAndUpdate(req.params.id, {activo: false}, {new:true});
            if (!result){
                return res.status(404).send("Espacio no encontrado")
            }
            return res.status(200).send(result)
        }catch (error) {
            console.log(error);
            if (error.name == "CastError"){
                return res.status(400).send("Id no valido")
            }
            if (error.name == "ValidationError"){
                return res.status(400).send("Datos no validos: "+error.message)
            }
            if (error.code == 11000){
                return res.status(409).send("Ya existe un registro")
            }
            return res.status(500).send("Error Interno")
        }
    }
    
}
module.exports = new EspacioController();