const logger = (req, res,  next) => {
    console.log("Metodo: ", req.method);
    console.log("URL: ", req.originalUrl);
next();
}
module.exports = logger