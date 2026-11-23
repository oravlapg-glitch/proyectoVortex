// Middleware: una función que se ejecuta ANTES de llegar al controlador
// Muestra en la consola el método (GET, POST...) y la URL de cada petición
const logger = (req, res, next) => {
    console.log("Método: ", req.method);
    console.log("URL: ", req.originalUrl);

    // next() → deja pasar la petición al siguiente middleware o al controlador
    next();
}

module.exports = logger
