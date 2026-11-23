import { useNavigate } from 'react-router-dom';
import { apiPost } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import Icon from './Icon';

// Color de cada tipo de producto en el carrito
const TIPO = {
  ropa: 'violet', perifericos: 'violet', accesorios: 'violet',
  comida: 'cyan', bebida: 'cyan', bonos: 'lime', torneos: 'lime',
};

// Contenido del carrito: líneas con + / -, total y botón de pedir.
// Lo uso en el panel lateral (desde cualquier página) y en la tienda
export default function CartPanel({ alPedir }) {
  const { user } = useAuth();
  const { lineas, cambiar, quitar, vaciar, total, setAbierto } = useCart();
  const toast = useToast();
  const nav = useNavigate();

  const pedir = async () => {
    if (!user) { setAbierto(false); return nav('/login'); }
    try {
      const p = await apiPost('/pedidos', { lineas: lineas.map((l) => ({ producto: l.producto, cantidad: l.cantidad, talla: l.talla })) });
      vaciar();
      toast(`Pedido ${p.codigo} creado. Lo tienes en Mi cuenta.`);
      if (alPedir) alPedir(); // por si la página quiere recargar el stock
    } catch (e) { toast(e.message, 'err'); }
  };

  if (!lineas.length) {
    return (
      <div className="empty sm">
        <Icon name="cart" size={32} />
        <p>El carrito está vacío.</p>
        <small className="muted">Añade productos, comida, bonos o inscripciones.</small>
      </div>
    );
  }

  return (
    <>
      <ul className="cart-list">
        {lineas.map((l, i) => (
          <li key={i} className={'ac-' + (TIPO[l.categoria] || 'violet')}>
            <div className="grow">
              <b>{l.nombre}</b>
              <small>{l.categoria}{l.talla && ` · talla ${l.talla}`} · {l.precio.toFixed(2)} €</small>
            </div>
            <div className="stepper">
              <button aria-label="Quitar uno" onClick={() => cambiar(i, -1)}>−</button>
              <span>{l.cantidad}</span>
              <button aria-label="Añadir uno" onClick={() => cambiar(i, 1)}>+</button>
            </div>
            <button className="icon-btn sm danger" aria-label={'Eliminar ' + l.nombre} onClick={() => quitar(i)}><Icon name="trash" size={15} /></button>
          </li>
        ))}
      </ul>
      <div className="cart-total"><span>Total</span><span className="price">{total.toFixed(2)} €</span></div>
      <button className="btn full" onClick={pedir}>
        {user ? 'Hacer pedido' : 'Inicia sesión para pedir'} <Icon name="arrow" size={18} />
      </button>
      <button className="btn o full mt-s" onClick={vaciar}>Vaciar carrito</button>
      <p className="muted small center">Pagas y recoges en el local. La comida te la llevamos a tu puesto.</p>
    </>
  );
}

// Panel que sale por la derecha al pulsar el carrito de arriba
export function CartDrawer() {
  const { abierto, setAbierto, unidades } = useCart();
  return (
    <>
      <div className={'backdrop' + (abierto ? ' show' : '')} onClick={() => setAbierto(false)} />
      <aside className={'drawer' + (abierto ? ' open' : '')} aria-label="Carrito" aria-hidden={!abierto}>
        <header>
          <h3><Icon name="cart" /> Mi pedido <span className="pill">{unidades}</span></h3>
          <button className="icon-btn sm" aria-label="Cerrar carrito" onClick={() => setAbierto(false)}><Icon name="x" size={16} /></button>
        </header>
        <div className="drawer-body"><CartPanel /></div>
      </aside>
    </>
  );
}
