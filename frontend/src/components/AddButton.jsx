import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import Icon from './Icon';

// Botón "Añadir" para cualquier producto (comida, bonos, torneos...).
// Si ya está en el carrito enseña cuántos llevo con botones - y +
export default function AddButton({ p, texto = 'Añadir', talla, disabled }) {
  const { add, lineas, cambiar, cuantos } = useCart();
  const toast = useToast();
  const n = cuantos(p._id);
  const agotado = p.stock < 1;

  const anadir = () => { add(p, talla); toast(`${p.nombre}${talla ? ' (' + talla + ')' : ''} añadido al carrito`); };
  const quitarUno = () => {
    const i = lineas.findIndex((l) => l.producto === p._id);
    if (i >= 0) cambiar(i, -1);
  };

  if (agotado) return <button className="btn sm" disabled>Agotado</button>;
  if (n > 0 && !p.tallas?.length) {
    return (
      <div className="stepper big" aria-label={`${n} en el carrito`}>
        <button aria-label="Quitar uno" onClick={quitarUno}>−</button>
        <span>{n}</span>
        <button aria-label="Añadir uno" onClick={anadir}>+</button>
      </div>
    );
  }
  return (
    <button className="btn sm" disabled={disabled} onClick={anadir}>
      <Icon name="cart" size={15} /> {texto}{n > 0 && ` (${n})`}
    </button>
  );
}
