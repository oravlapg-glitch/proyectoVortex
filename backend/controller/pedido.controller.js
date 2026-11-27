const Pedido = require("../model/pedido.model");
const Producto = require("../model/producto.model");

const devolverStock = async (lineas) => {
    for (const linea of lineas) {
        await Producto.updateOne({ _id: linea.producto }, { $inc: { stock: linea.cantidad } });
    }
}

const SIGUIENTE = { pendiente: ["listo", "cancelado"], listo: ["recogido", "cancelado"] }

class PedidoController {

  async createPedido(req, res){
    let lineas = []
    try {
        for (const item of req.body.lineas) {
            const cantidad = Number(item.cantidad);
            let error = null;

            const producto = await Producto.findById(item.producto);
            if (!Number.isInteger(cantidad) || cantidad < 1) {
                error = [400, "Cantidad no válida"];
            } else if (!producto || !producto.activo) {
                error = [404, "producto no encontrado"];
            } else if (producto.tallas.length > 0 && !producto.tallas.includes(item.talla)) {
                error = [400, "Elige una talla para " + producto.nombre + ": " + producto.tallas.join(", ")];
            } else {
                const resultado = await Producto.updateOne(
                    { _id: producto._id, stock: { $gte: cantidad } },
                    { $inc: { stock: -cantidad } }
                );
                if (resultado.modifiedCount == 0) {
                    error = [409, "No hay stock suficiente de " + producto.nombre];
                }
            }

            if (error) {
                await devolverStock(lineas);
                return res.status(error[0]).send(error[1])
            }

            lineas.push({
                producto: producto._id,
                nombre: producto.nombre,
                talla: item.talla || null,
                cantidad: cantidad,
                precioUnitario: producto.precio
            });
        }

        let total = 0;
        for (const linea of lineas) {
            total = total + linea.cantidad * linea.precioUnitario;
        }

        const pedidoNuevo = new Pedido({ cliente: req.user.id, lineas: lineas, total: total });
        const result = await pedidoNuevo.save();
        return res.status(201).send(result)
    } catch (error) {
        console.log(error);
        await devolverStock(lineas);
        if (error.name == "CastError") {
            return res.status(400).send("Id no válido")
        }
        if (error.name == "ValidationError") {
            return res.status(400).send("Datos no válidos: " + error.message)
        }
        if (error.code == 11000) {
            return res.status(409).send("Ya existe un registro con esos datos")
        }
        return res.status(500).send("Error interno")
    }
  }

  async getPedidos(req, res){
    try {
        let filter = {}
        if (req.user.rol == "CLIENTE") {
            filter.cliente = req.user.id
        }
        if (req.query.estado) {
            filter.estado = req.query.estado
        }
        const result = await Pedido.find(filter).populate("cliente", "nombre email").sort({ createdAt: -1 });
        return res.status(200).send(result)
    } catch (error) {
        console.log(error);
        if (error.name == "CastError") {
            return res.status(400).send("Id no válido")
        }
        if (error.name == "ValidationError") {
            return res.status(400).send("Datos no válidos: " + error.message)
        }
        if (error.code == 11000) {
            return res.status(409).send("Ya existe un registro con esos datos")
        }
        return res.status(500).send("Error interno")
    }
  }

  async getPedidoById(req, res){
    try {
        const result = await Pedido.findById(req.params.id).populate("cliente", "nombre email");
        if (!result){
            return res.status(404).send("pedido no encontrado")
        }
        if (req.user.rol == "CLIENTE" && String(result.cliente._id) != req.user.id){
            return res.status(403).send("No tienes acceso a este pedido")
        }
        return res.status(200).send(result)
    } catch (error) {
        console.log(error);
        if (error.name == "CastError") {
            return res.status(400).send("Id no válido")
        }
        if (error.name == "ValidationError") {
            return res.status(400).send("Datos no válidos: " + error.message)
        }
        if (error.code == 11000) {
            return res.status(409).send("Ya existe un registro con esos datos")
        }
        return res.status(500).send("Error interno")
    }
  }

  async updateEstado(req, res){
    try {
        const nuevoEstado = req.body.estado;
        const pedido = await Pedido.findById(req.params.id);
        if (!pedido){
            return res.status(404).send("pedido no encontrado")
        }

        if (req.user.rol == "CLIENTE") {
            if (String(pedido.cliente) != req.user.id){
                return res.status(403).send("No tienes acceso a este pedido")
            }
            if (nuevoEstado != "cancelado" || pedido.estado != "pendiente"){
                return res.status(400).send("Solo puedes cancelar pedidos pendientes")
            }
        } else {
            const permitidos = SIGUIENTE[pedido.estado] || [];
            if (!permitidos.includes(nuevoEstado)){
                return res.status(400).send("No se puede pasar de " + pedido.estado + " a " + nuevoEstado)
            }
        }

        if (nuevoEstado == "cancelado") {
            await devolverStock(pedido.lineas);
        }
        if (nuevoEstado == "recogido") {
            pedido.fechaRecogida = new Date();
        }
        pedido.estado = nuevoEstado;
        const result = await pedido.save();
        return res.status(200).send(result)
    } catch (error) {
        console.log(error);
        if (error.name == "CastError") {
            return res.status(400).send("Id no válido")
        }
        if (error.name == "ValidationError") {
            return res.status(400).send("Datos no válidos: " + error.message)
        }
        if (error.code == 11000) {
            return res.status(409).send("Ya existe un registro con esos datos")
        }
        return res.status(500).send("Error interno")
    }
  }
}

module.exports = new PedidoController();