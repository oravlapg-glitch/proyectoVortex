// Array con los usuarios de prueba (uno o dos de cada rol). Se usa en cargaInicial (usuario.controller)
// Las contraseñas están sin encriptar AQUÍ, pero el controlador las encripta con bcrypt antes de guardarlas
const usuarios = [
    { nombre: 'Admin Vortex', email: 'admin@vortex.test', password: 'Admin123!', rol: 'ADMIN' },
    { nombre: 'Carlos Soporte', email: 'agente1@vortex.test', password: 'Agente123!', rol: 'AGENTE' },
    { nombre: 'Lucía Soporte', email: 'agente2@vortex.test', password: 'Agente123!', rol: 'AGENTE' },
    { nombre: 'Ana Cliente', email: 'ana@vortex.test', password: 'Cliente123!', rol: 'CLIENTE' },
    { nombre: 'Luis Cliente', email: 'luis@vortex.test', password: 'Cliente123!', rol: 'CLIENTE' }
]

module.exports = usuarios;
