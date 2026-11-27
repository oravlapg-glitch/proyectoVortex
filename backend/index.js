require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');// importa mongoose, para poder conectarse
const cors = require('cors');// importa cors, permite al frontend la llamada de la API 

const rutaUsuarios = require('./routes/usuario.routes')
const rutaEspacios = require('./routes/espacio.routes')
const rutaCategorias = require('./routes/categoria.routes')
const rutaTickets = require('./routes/ticket.routes')
const rutaReservas = require('./routes/reserva.routes')
const rutaProductos = require('./routes/producto.routes')
const rutaPedido = require('./routes/pedido.routes')

const logger = require('./middleware/logger.middleware')

app.use(cors({ origin: process.env.FRONTEND_URL}));
app.use(express.json());
app.use(logger);// IMPORTANTE va antes de las rutas si va despues no se ejecuta

app.get('/api/health', (req, res) =>{
    res.status(200).send({ ok: true, mensaje: "Funcioooooonaaaaaaaaaaa"})
});

app.use('/api/usuarios', rutaUsuarios);
app.use('/api/espacios', rutaEspacios);
app.use('/api/categorias', rutaCategorias);
app.use('/api/tickets',rutaTickets);
app.use('/api/reservas', rutaReservas);
app.use('/api/productos', rutaProductos);
app.use('/api/pedidos', rutaPedido);

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

//ARANCO EL SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Aplicacion arrancada en puerto " + PORT);
});

//ARRANCO MONGO
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("BBDD en marcha!!"))
.catch(() => console.log("La BBDD petó"))