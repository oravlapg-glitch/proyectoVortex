import { createContext, useContext, useState } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

// El carrito lo guardo en el navegador; el pedido real solo existe cuando lo envío al backend.
// Sirve para todo: tienda, comida, bebidas, bonos y torneos (en el backend todos son "productos")
export function CartProvider({ children }) {
  const [lineas, setLineas] = useState(() => JSON.parse(localStorage.getItem('cart') || '[]'));
  const [abierto, setAbierto] = useState(false); // panel lateral del carrito
  const guardar = (l) => { setLineas(l); localStorage.setItem('cart', JSON.stringify(l)); };

  const add = (p, talla) => {
    const i = lineas.findIndex((x) => x.producto === p._id && x.talla === talla);
    if (i >= 0) guardar(lineas.map((x, j) => (j === i ? { ...x, cantidad: x.cantidad + 1 } : x)));
    else guardar([...lineas, { producto: p._id, nombre: p.nombre, precio: p.precio, categoria: p.categoria, talla, cantidad: 1 }]);
  };
  // Suma o resta unidades; si llega a 0 quito la línea
  const cambiar = (i, delta) =>
    guardar(lineas.map((x, j) => (j === i ? { ...x, cantidad: x.cantidad + delta } : x)).filter((x) => x.cantidad > 0));
  const quitar = (i) => guardar(lineas.filter((_, j) => j !== i));
  const vaciar = () => guardar([]);

  const unidades = lineas.reduce((s, l) => s + l.cantidad, 0);
  const total = lineas.reduce((s, l) => s + l.precio * l.cantidad, 0);
  // Cuántas unidades de un producto llevo (para pintar el contador en las tarjetas)
  const cuantos = (id) => lineas.filter((l) => l.producto === id).reduce((s, l) => s + l.cantidad, 0);

  return (
    <CartContext.Provider value={{ lineas, add, cambiar, quitar, vaciar, unidades, total, cuantos, abierto, setAbierto }}>
      {children}
    </CartContext.Provider>
  );
}
