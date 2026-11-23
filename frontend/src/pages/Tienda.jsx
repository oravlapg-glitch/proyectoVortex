import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGet, apiPost } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import Icon from '../components/Icon';
import ProductCard from '../components/ProductCard';
import SectionHead from '../components/SectionHead';

const CATS = [
  { v: '', txt: 'Todo', icon: 'star' },
  { v: 'perifericos', txt: 'Periféricos', icon: 'keyboard' },
  { v: 'accesorios', txt: 'Accesorios', icon: 'box' },
  { v: 'ropa', txt: 'Ropa', icon: 'shirt' },
];

export default function Tienda() {
  const { user } = useAuth();
  const { lineas, quitar, vaciar } = useCart();
  const toast = useToast();
  const nav = useNavigate();
  const [prods, setProds] = useState([]);
  const [cat, setCat] = useState('');
  const [q, setQ] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargar = () =>
    apiGet(`/productos?categoria=${cat}&q=${encodeURIComponent(q)}`)
      .then((r) => { setProds(r); setError(''); })
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  useEffect(() => { cargar(); }, [cat, q]);

  const total = lineas.reduce((s, l) => s + l.precio * l.cantidad, 0);

  const pedir = async () => {
    if (!user) return nav('/login');
    try {
      const p = await apiPost('/pedidos', { lineas: lineas.map((l) => ({ producto: l.producto, cantidad: l.cantidad, talla: l.talla })) });
      vaciar();
      toast(`Pedido ${p.codigo} creado. Lo recoges en el local.`);
      cargar(); // recargo para ver el stock actualizado
    } catch (e) { toast(e.message, 'err'); }
  };

  return (
    <>
      <SectionHead tag="Tienda" titulo={<>EQUÍPATE PARA EL <span className="lime">SIGUIENTE NIVEL</span></>}>
        Periféricos, accesorios y merch oficial. Pides online y lo recoges en el local.
      </SectionHead>
      {error && <p className="err">{error}</p>}

      <div className="two">
        <div>
          <div className="toolbar">
            <label className="search">
              <Icon name="search" size={18} />
              <input placeholder="Buscar producto…" aria-label="Buscar" value={q} onChange={(e) => setQ(e.target.value)} />
            </label>
            <div className="chips" role="group" aria-label="Categoría">
              {CATS.map((c) => (
                <button key={c.v} className={'chip' + (cat === c.v ? ' sel' : '')} onClick={() => setCat(c.v)}>
                  <Icon name={c.icon} size={16} />{c.txt}
                </button>
              ))}
            </div>
          </div>
          <div className="grid">
            {cargando && [1, 2, 3].map((i) => <div key={i} className="pcard skeleton" />)}
            {prods.map((p) => <ProductCard key={p._id} p={p} />)}
          </div>
          {!cargando && !prods.length && <div className="empty"><Icon name="search" size={36} /><p>No hay productos con esos filtros.</p></div>}
        </div>

        <aside className="card cart sticky">
          <h3><Icon name="cart" /> Mi pedido</h3>
          {!lineas.length && <div className="empty sm"><p>El carrito está vacío.</p><small className="muted">Añade algo con el botón verde.</small></div>}
          <ul className="cart-list">
            {lineas.map((l, i) => (
              <li key={i}>
                <span className="qty">{l.cantidad}×</span>
                <span className="grow">{l.nombre}{l.talla && <small> · {l.talla}</small>}</span>
                <b>{(l.precio * l.cantidad).toFixed(2)} €</b>
                <button className="icon-btn sm danger" aria-label={'Quitar ' + l.nombre} onClick={() => quitar(i)}><Icon name="trash" size={16} /></button>
              </li>
            ))}
          </ul>
          <div className="cart-total"><span>Total</span><span className="price">{total.toFixed(2)} €</span></div>
          <button className="btn full" disabled={!lineas.length} onClick={pedir}>
            {user ? 'Hacer pedido' : 'Inicia sesión para pedir'} <Icon name="arrow" size={18} />
          </button>
          <p className="muted small center">Pago y recogida en el local</p>
        </aside>
      </div>
    </>
  );
}
