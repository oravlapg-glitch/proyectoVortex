//variables de entorno
// Lee el archivo .env y guarda sus variables en process.env. Va lo PRIMERO
require('dotenv').config();

// Importa Express y crea la aplicación (el servidor)
const express = require('express');
const app = express();
// Importa Mongoose (para conectarse a MongoDB)
const mongoose = require('mongoose');
// Importa cors: permite que el frontend (React) llame a esta API
const cors = require('cors');

// ---- ZONA 1: importa los archivos de rutas (se añaden desde el Paso 3) ----
const rutaUsuarios = require('./routes/usuario.routes')
const rutaEspacios = require('./routes/espacio.routes')
const rutaCategorias = require('./routes/categoria.routes')
const rutaTickets = require('./routes/ticket.routes')
const rutaReservas = require('./routes/reserva.routes')
const rutaProductos = require('./routes/producto.routes')
const rutaPedidos = require('./routes/pedido.routes')

// ---- ZONA 2: importa los middlewares ----
const logger = require('./middleware/logger.middleware')

//Middleware
// Solo deja llamar a la API desde la URL de nuestro frontend
app.use(cors({ origin: process.env.FRONTEND_URL }));
// Permite leer el JSON que llega en el body (req.body)
app.use(express.json());
// El logger va ANTES de las rutas (si va después, nunca se ejecuta)
app.use(logger);

// Ruta de prueba: GET http://localhost:3000/api/health
app.get('/api/health', (req, res) => {
    res.status(200).send({ ok: true, mensaje: "API Vortex Gaming funcionando" })
});

// ---- ZONA 3: conecta cada archivo de rutas con su prefijo (se añaden desde el Paso 3) ----
app.use('/api/usuarios', rutaUsuarios);
app.use('/api/espacios', rutaEspacios);
app.use('/api/categorias', rutaCategorias);
app.use('/api/tickets', rutaTickets);
app.use('/api/reservas', rutaReservas);
app.use('/api/productos', rutaProductos);
app.use('/api/pedidos', rutaPedidos);
// swagger → http://localhost:3000/api-docs
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Arranca el servidor. process.env.PORT lo usa Render al desplegar; en local es 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Aplicacion arrancada en el puerto " + PORT);
});

// Conecta con MongoDB usando la URL del .env
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("BBDD en marcha!!"))
    .catch((error) => console.log(` La bbdd hizo kaboom${error}`))