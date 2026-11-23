// Productos de ejemplo. Se usa en cargaInicial (producto.controller)
// Tienda (ropa, perifericos, accesorios) + carta (comida, bebida) + bonos de horas + torneos y eventos
const productos = [
    // Tienda
    { nombre: 'Sudadera Vortex', categoria: 'ropa', precio: 35, tallas: ['S', 'M', 'L', 'XL'], stock: 20 },
    { nombre: 'Camiseta Vortex', categoria: 'ropa', precio: 18, tallas: ['S', 'M', 'L', 'XL'], stock: 30 },
    { nombre: 'Teclado mecánico Vortex TKL', categoria: 'perifericos', precio: 79, stock: 8 },
    { nombre: 'Alfombrilla XXL', categoria: 'accesorios', precio: 22, stock: 15 },

    // Comida
    { nombre: 'Menú especial Gamers', categoria: 'comida', precio: 11.9, stock: 999, descripcion: 'Burger + bebida + snack' },
    { nombre: 'Burger Gamer', categoria: 'comida', precio: 9.5, stock: 999, descripcion: 'Doble carne, cheddar y salsa Vortex.' },
    { nombre: 'Pizza Respawn', categoria: 'comida', precio: 8.9, stock: 999, descripcion: 'Pepperoni y mozzarella, 4 porciones.' },
    { nombre: 'Bocata Lag Zero', categoria: 'comida', precio: 5.5, stock: 999, descripcion: 'Pollo crujiente, lechuga y mayo.' },
    { nombre: 'Combo Nachos', categoria: 'comida', precio: 6.9, stock: 999, descripcion: 'Nachos con queso y guacamole.' },
    { nombre: 'Snacks variados', categoria: 'comida', precio: 2.5, stock: 999, descripcion: 'Patatas, palomitas o frutos secos.' },
    { nombre: 'Dulces', categoria: 'comida', precio: 2, stock: 999, descripcion: 'Donuts, cookies y chocolatinas.' },

    // Bebidas
    { nombre: 'Agua', categoria: 'bebida', precio: 1.5, stock: 999, descripcion: 'Botella de 50 cl.' },
    { nombre: 'Refrescos', categoria: 'bebida', precio: 2.5, stock: 999, descripcion: 'Cola, naranja, limón…' },
    { nombre: 'Bebida energética', categoria: 'bebida', precio: 3.5, stock: 999, descripcion: 'Lata de 500 ml bien fría.' },
    { nombre: 'Zumos', categoria: 'bebida', precio: 2.8, stock: 999, descripcion: 'Naranja, piña o melocotón.' },
    { nombre: 'Café', categoria: 'bebida', precio: 1.8, stock: 999, descripcion: 'Solo, con leche o capuccino.' },
    { nombre: 'Batido de fresa', categoria: 'bebida', precio: 4.5, stock: 999, descripcion: 'Con nata y sirope.' },

    // Bonos y tarifas especiales (se activan en recepción al recoger el pedido)
    { nombre: 'Bono 3 horas', categoria: 'bonos', precio: 12.99, stock: 999, descripcion: '-13% de descuento' },
    { nombre: 'Bono 5 horas', categoria: 'bonos', precio: 19.99, stock: 999, descripcion: '-20% de descuento' },
    { nombre: 'Bono 10 horas', categoria: 'bonos', precio: 34.99, stock: 999, descripcion: '-30% de descuento' },
    { nombre: 'Pase diario', categoria: 'bonos', precio: 24.99, stock: 999, descripcion: 'Juega todo el día sin mirar el reloj.' },
    { nombre: 'Tarifa nocturna', categoria: 'bonos', precio: 9.99, stock: 999, descripcion: 'De 20:00 a cierre, hasta 3 horas.' },
    { nombre: 'Abono mensual', categoria: 'bonos', precio: 59.99, stock: 999, descripcion: '30 horas al mes + 10% en la tienda.' },
    { nombre: 'Pack amigos', categoria: 'bonos', precio: 49.99, stock: 999, descripcion: '4 jugadores, 3 horas y bebida incluida.' },

    // Torneos (el stock son las plazas) y eventos
    { nombre: 'Inscripción Vortex Cup Fútbol', categoria: 'torneos', precio: 5, stock: 32, descripcion: 'Sábados 18:00 · 32 jugadores · Premio: 150 € + trofeo' },
    { nombre: 'Inscripción Shooter 5v5 Night', categoria: 'torneos', precio: 25, stock: 8, descripcion: 'Viernes 21:00 · 8 equipos · Premio: 5 bonos de 10 h' },
    { nombre: 'Inscripción Kart Party 2v2', categoria: 'torneos', precio: 8, stock: 16, descripcion: 'Domingos 17:00 · 16 parejas · Premio: merch Vortex' },
    { nombre: 'Pack cumpleaños gaming', categoria: 'torneos', precio: 12.5, stock: 999, descripcion: 'Por persona: sala, tarta, menú y mini torneo.' },
    { nombre: 'Pack evento privado', categoria: 'torneos', precio: 15, stock: 999, descripcion: 'Por persona: espacio a tu medida, comida y bebida.' },
    { nombre: 'Pack entrenamiento equipo', categoria: 'torneos', precio: 39.99, stock: 999, descripcion: 'Sala 3 h + horas de PC + comida para 5.' }
]

module.exports = productos;
