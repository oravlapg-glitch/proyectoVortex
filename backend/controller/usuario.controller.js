const Usuario = require("../model/usuario.model");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const usuarios =require("../bbdd/usuarios");

class UsuarioController {
    async cargaInicial(req, res) {
        try {
            for (const usuario of usuarios) {
                const passwordEncriptado = await bcrypt.hash(usuario.password, 10);
                await Usuario.updateOne(
                    {email: usuario.email },
                    {...usuario, password: passwordEncriptado},
                    {upsert : true}
                );
            }
            return res.status(201).send("Carga de usuarios completada")
        }catch (error) {
            console.log(error);
            if (error.name == "CastError"){
                return res.status(400).send("Id no valido")
            }
            if (error.name == "ValidationError"){
                return res.status(400).send("Datos no validos: "+ error.message)
            }
            if (error.code == 11000){
                return res.status(409).send("Ya existe un regrito con este dato")
            }
            return res.status(500).send("Error interno")
        }
    }
    async signUp(req, res){
        try{
            const existe  = await Usuario.findOne({email: String(req.body.email).toLowerCase() });
            if (existe) {
                return res.status(409).send("este email ya esta registrado")
            }
            const passwordEncriptado = await bcrypt.hash(req.body.password, 10)
            const usuario = new Usuario ({
                nombre: req.body.nombre,
                email: req.body.email,
                password: passwordEncriptado,
                rol: "CLIENTE"
            })
            const result = await usuario.save(); // no devolvemos la contraseña
            return res.status(201).send({ id: result._id, nombre:  result.nombre, email: result.email, rol: result.rol});
        } catch (error) {
            console.error("Error al hacer login", error);
            if (error.name == "CastError") {
                return res.status(400).send("Id no valido")
            }
            if(error.name == "ValidationError") {
                return res.status(400).send("Datos no validos: " + error.message)
            }
            if (error.code == 11000){
                return res.status(409).send("Ya existe un registro con estos datos")
            }
            return res.status(500).send("Error interno")
        }
    }
    async logIn(req,res){
        try{
            const user = await Usuario.findOne({email: String(req.body.email).toLowerCase() }).select("+password");
            const isTruePassword = user ? await bcrypt.compare(req.body.password, user.password) : false;

            if (!user || !isTruePassword){
                return res.status(401).send("Email o contraseña incorrectos")
            }

            const token = jwt.sign(
                {id: user._id, nombre: user.nombre, rol: user.rol},
                process.env.TOKEN_PASSWORD,
                {expiresIn: "2h"}
            )

            return res.status(200).json({
                mensaje: "Inicio de sesion correcto",
                token: token,
                usuario: {id: user._id, nombre: user.nombre, email: user.email, rol: user.rol}
            });
        }catch (error){
            console.error("Error al hacer login", error);
            if (error.name == "CastError"){
                return res.status(400).send("Id no valido")
            }
            if (error.name == "ValidationError") {
                return res.status(400).send("Datos no validos: "+error.message)
            }
            if (error.code == 11000){
                return res.status(409).send("ya esiste un registro")
            }
            return res.status(500).send("Error interno")
        }
    }
    async getMe(req, res){
        try{
            const result = await Usuario.findById(req.user.id);
            if (!result){
                return res.status(404).send("usuario no encontrado")
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
                return res.status(409).send("Ya existe un regisro")
            }
            return res.status(500).send("Erorn interno")
        }
    }
    async updateMe(req, res){
        try{
            const usuario = await Usuario.findById(req.user.id);
            if (!usuario){
                return res.status(404).send("usuario no encontrado")
            }
            if (req.body.nombre) usuario.nombre = req.body.nombre;
            if (req.body.email) usuario.email = req.body.email;
            if(req.body.password){
                if  (String(req.body.password).length < 8){
                    return res.status(400).send("La contraseña debe tener 8 caracteres jajaaj")
                }
                usuario.password = await bcrypt.hash(req.body.password, 10);
            }
            const result = await usuario.save();
            return res.status(200).send(result);
        } catch (error){
            console.log(error);
            if (error.name == "CastError"){
                return res.status(400).send("Id no valido")
            }
            if (error.name == "ValidationError"){
                return res.status(400).send("Datos no validos: "+error.message)
            }
            if (error.code == 11000){
                return res.status(409).send("Ya existe ")
            }
            return res.status(500).send("Error interno")
        }
    }
    async getUsers(req, res){
        try{
            let filter = {}
            if (req.query.rol) {
                filter.rol = req.query.rol
            }
            const result = await Usuario.find(filter).sort({ createdAt: -1});
            return res.status(200).send(result);
        }catch (error){
            console.log(error);
            if (error.name == "CastError"){
                return res.status(400).send("Id no valido")
            }
            if (error.name == "ValidationError"){
                return res.status(400).send(" Datos no validos: "+error.message)
            }
            if (error.code == 11000){
                return res.status(409).send("Ya existe un registro")
            }
            return res.status(500).send("Error interno")
        }
    }
    async cambiarRol(req, res){
        try{
            if (!["CLIENTE", "AGENTE", "ADMIN"].includes(req.body.rol)){
                return res.status(400).send("Rol no valido")
            }
            if (req.params.id === req.user.id){
                return res.status(400).send("No puedes cambiar de rol")
            }
            const usuario = await Usuario.findById(req.params.id);
            if (!usuario){
                return res.status(404).send("usuario no encontrado")
            }
            usuario.rol = req.body.rol;
            const result = await usuario.save();
            return res.status(200).send(result);
        }catch (error){
            console.log(error);
            if (error.name == "CastError"){
                return res.status(400).send("Id no valido ")
            }
            if (error.name == "ValidationError"){
                return res.status(400).send("Datos no validos: "+error.message)
            }
            if (error.code == 11000){
                return res.status(409).send("Ya existe ")
            }
            return res.status(500).send("Error interno")
        }
    }
}
module.exports = new UsuarioController()