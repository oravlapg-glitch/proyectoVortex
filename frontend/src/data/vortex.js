// Datos fijos del local que (de momento) no están en la base de datos del backend:
// bonos, carta de comida y torneos. Los muestro en la web como información.

export const TARIFAS = [
  { id: '1h', titulo: '1 hora', precio: 4.99, nota: 'Pago por hora', items: ['PC Gaming', 'Acceso libre'] },
  { id: '3h', titulo: 'Bono 3 horas', precio: 12.99, nota: '-13% de descuento', items: ['PC Gaming', 'Válido 1 mes'] },
  { id: '5h', titulo: 'Bono 5 horas', precio: 19.99, nota: '-20% de descuento', items: ['PC Gaming', 'Válido 2 meses'] },
  { id: '10h', titulo: 'Bono 10 horas', precio: 34.99, nota: '-30% de descuento', items: ['PC Gaming', 'Bebida gratis'], top: true },
];

export const ESPECIALES = [
  { icon: 'calendar', titulo: 'Pase diario', precio: 24.99, texto: 'Juega todo el día sin mirar el reloj.' },
  { icon: 'moon', titulo: 'Tarifa nocturna', precio: 9.99, texto: 'De 20:00 a cierre, hasta 3 horas.' },
  { icon: 'star', titulo: 'Abono mensual', precio: 59.99, texto: '30 horas al mes + 10% en la tienda.' },
  { icon: 'users', titulo: 'Pack amigos', precio: 49.99, texto: '4 jugadores, 3 horas y bebida incluida.' },
];

export const CARTA = {
  comida: [
    { emoji: '🍔', nombre: 'Burger Gamer', precio: 9.5, desc: 'Doble carne, cheddar y salsa Vortex.' },
    { emoji: '🍕', nombre: 'Pizza Respawn', precio: 8.9, desc: 'Pepperoni y mozzarella, 4 porciones.' },
    { emoji: '🥪', nombre: 'Bocata Lag Zero', precio: 5.5, desc: 'Pollo crujiente, lechuga y mayo.' },
    { emoji: '🍟', nombre: 'Combo Nachos', precio: 6.9, desc: 'Nachos con queso y guacamole.' },
    { emoji: '🍿', nombre: 'Snacks variados', precio: 2.5, desc: 'Patatas, palomitas o frutos secos.' },
    { emoji: '🍩', nombre: 'Dulces', precio: 2.0, desc: 'Donuts, cookies y chocolatinas.' },
  ],
  bebidas: [
    { emoji: '💧', nombre: 'Agua', precio: 1.5, desc: 'Botella de 50 cl.' },
    { emoji: '🥤', nombre: 'Refrescos', precio: 2.5, desc: 'Cola, naranja, limón…' },
    { emoji: '⚡', nombre: 'Bebida energética', precio: 3.5, desc: 'Lata de 500 ml bien fría.' },
    { emoji: '🧃', nombre: 'Zumos', precio: 2.8, desc: 'Naranja, piña o melocotón.' },
    { emoji: '☕', nombre: 'Café', precio: 1.8, desc: 'Solo, con leche o capuccino.' },
    { emoji: '🍓', nombre: 'Batido de fresa', precio: 4.5, desc: 'Con nata y sirope.' },
  ],
};

export const MENU_ESPECIAL = { titulo: 'Menú especial Gamers', texto: 'Burger + bebida + snack', precio: 11.9 };

export const TORNEOS = [
  { juego: 'Vortex Cup · Fútbol', fecha: 'Sábados · 18:00', plazas: '32 jugadores', premio: '150 € + trofeo', estado: 'en curso' },
  { juego: 'Shooter 5v5 Night', fecha: 'Viernes · 21:00', plazas: '8 equipos', premio: '5 bonos de 10 h', estado: 'inscripciones' },
  { juego: 'Kart Party 2v2', fecha: 'Domingos · 17:00', plazas: '16 parejas', premio: 'Merch Vortex', estado: 'inscripciones' },
];

export const RANKING = [
  { nick: 'DarkNova', pts: 120 },
  { nick: 'NeoX', pts: 95 },
  { nick: 'LimeForce', pts: 87 },
  { nick: 'Zeta', pts: 76 },
  { nick: 'Kira', pts: 63 },
];

export const EVENTOS = [
  { icon: 'gift', titulo: 'Cumpleaños gaming', texto: 'Sala privada, tarta, menú para todos y un mini torneo con premio para el cumpleañero.', desde: 12.5 },
  { icon: 'users', titulo: 'Eventos privados', texto: 'Team building, presentaciones o quedadas. Te montamos el espacio a tu medida.', desde: 15 },
  { icon: 'ticket', titulo: 'Packs para equipos', texto: 'Entrena con tu equipo: sala, horas de PC y comida a precio cerrado.', desde: 39.99 },
];
