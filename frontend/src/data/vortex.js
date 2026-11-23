// Los productos (tienda, comida, bebidas, bonos y torneos) vienen del backend: /api/productos?categoria=...
// Aquí solo guardo cosas visuales que no están en la base de datos, buscadas por el nombre del producto.

export const TIENDA_CATS = ['ropa', 'perifericos', 'accesorios'];

// Detalles de los bonos: los que empiezan por "Bono" salen como tarjeta de precio, el resto como tarifa especial
export const BONOS = {
  'Bono 3 horas': { items: ['PC Gaming', 'Válido 1 mes'] },
  'Bono 5 horas': { items: ['PC Gaming', 'Válido 2 meses'] },
  'Bono 10 horas': { items: ['PC Gaming', 'Bebida gratis'], top: true },
  'Pase diario': { icon: 'calendar' },
  'Tarifa nocturna': { icon: 'moon' },
  'Abono mensual': { icon: 'star' },
  'Pack amigos': { icon: 'users' },
};

// Torneos (inscripciones) y eventos. Si no está aquí, lo trato como evento
export const TORNEOS = {
  'Inscripción Vortex Cup Fútbol': { estado: 'en curso' },
  'Inscripción Shooter 5v5 Night': { estado: 'inscripciones' },
  'Inscripción Kart Party 2v2': { estado: 'inscripciones' },
};
export const EVENTO_ICON = { 'Pack cumpleaños gaming': 'gift', 'Pack evento privado': 'users', 'Pack entrenamiento equipo': 'ticket' };

export const RANKING = [
  { nick: 'DarkNova', pts: 120 },
  { nick: 'NeoX', pts: 95 },
  { nick: 'LimeForce', pts: 87 },
  { nick: 'Zeta', pts: 76 },
  { nick: 'Kira', pts: 63 },
];
