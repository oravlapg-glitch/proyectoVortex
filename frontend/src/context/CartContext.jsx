import { createContext, useContext, useState } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

// El carrito lo guardo en el navegador; el pedido real solo existe cuando lo envío al backend
export function CartProvider({ children }) {
  const [lineas, setLineas] = useState(() => JSON.parse(localStorage.getItem('cart') || '[]'));
  const guardar = (l) => { setLineas(l); localStorage.setItem('cart', JSON.stringify(l)); };

  const add = (p, talla) => {
    const i = lineas.findIndex((x) => x.producto === p._id && x.talla === talla);
    if (i >= 0) guardar(lineas.map((x, j) => (j === i ? { ...x, cantidad: x.cantidad + 1 } : x)));
    else guardar([...lineas, { producto: p._id, nombre: p.nombre, precio: p.precio, talla, cantidad: 1 }]);
  };
  const quitar = (i) => guardar(lineas.filter((_, j) => j !== i));
  const vaciar = () => guardar([]);

  return <CartContext.Provider value={{ lineas, add, quitar, vaciar }}>{children}</CartContext.Provider>;
}
