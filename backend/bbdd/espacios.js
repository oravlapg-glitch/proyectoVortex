// PCs y salas de ejemplo. Se usa en cargaInicial (espacio.controller)
const espacios = [
    { nombre: 'PC 01', tipo: 'pc', capacidad: 1, precioHora: 3, specs: ['RTX 4070', 'Monitor 240 Hz', 'Teclado mecánico'] },
    { nombre: 'PC 02', tipo: 'pc', capacidad: 1, precioHora: 3, specs: ['RTX 4070', 'Monitor 240 Hz'] },
    { nombre: 'PC 03', tipo: 'pc', capacidad: 1, precioHora: 4, specs: ['RTX 4080', 'Monitor 360 Hz'] },
    { nombre: 'PC 04', tipo: 'pc', capacidad: 1, precioHora: 2.5, specs: ['RTX 4060', 'Monitor 144 Hz'] },
    { nombre: 'Sala Seúl', tipo: 'sala', capacidad: 4, precioHora: 15, specs: ['PS5', 'TV 65"', 'Sofá'] },
    { nombre: 'Sala Busan', tipo: 'sala', capacidad: 6, precioHora: 20, specs: ['Xbox Series X', 'PS5', 'Proyector'] },
    { nombre: 'Sala Lima', tipo: 'sala', capacidad: 2, precioHora: 10, specs: ['Nintendo Switch', 'TV 55"'] }
]

module.exports = espacios;
