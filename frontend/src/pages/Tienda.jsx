import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGet, apiPost } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Tienda() {
  const { user } = useAuth();
  const { lineas, add, quitar, vaciar } = useCart();
  const nav = useNavigate();
  const [prods, setProds] = useState([]);
  const [cat, setCat] = useState('');
  const [q, setQ] = useState('');
  const [tallas, setTallas] = useState({});
  const [msg, setMsg] = useState(null);

  const cargar = () =>
    apiGet(`/productos?categoria=${cat}&q=${encodeURIComponent(q)}`).then(setProds).catch((e) => setMsg({ err: e.message }));
  useEffect(() => { cargar(); }, [cat, q]);

  const total = lineas.reduce((s, l) => s + l.precio * l.cantidad, 0);

  const pedir = async () => {
    if (!user) return nav('/login');
    try {
      const p = await apiPost('/pedidos', { lineas: lineas.map((l) => ({ producto: l.producto, cantidad: l.cantidad, talla: l.talla })) });
      vaciar();
      setMsg({ ok: `Pedido ${p.codigo} creado. Lo recoges en el local.` });
      cargar(); // recargo para ver el stock actualizado
    } catch (e) { setMsg({ err: e.message }); }
  };

  return (
    <>
      <h1>Tienda <span className="lime">Vortex</span></h1>
      {msg?.err && <p className="err">{msg.err}</p>}
      {msg?.ok && <p className="ok">{msg.ok}</p>}
      <div className="two">
        <div>
          <div className="row">
            <input placeholder="Buscar producto…" aria-label="Buscar" value={q} onChange={(e) => setQ(e.target.value)} />
            <select aria-label="Categoría" value={cat} onChange={(e) => setCat(e.target.value)}>
              <option value="">Todas las categorías</option>
              <option value="ropa">Ropa</option>
              <option value="perifericos">Periféricos</option>
              <option value="accesorios">Accesorios</option>
            </select>
          </div>
          <div className="grid">
            {prods.map((p) => (
              <div className="card" key={p._id}>
                <span className="tag">{p.categoria}</span>
                <h3>{p.nombre}</h3>
                <p className="price">{p.precio.toFixed(2)} €</p>
                <p>{p.stock > 0 ? `Stock: ${p.stock}` : <span className="red">Agotado</span>}</p>
                {p.tallas?.length > 0 && (
                  <select aria-label="Talla" value={tallas[p._id] || ''} onChange={(e) => setTallas({ ...tallas, [p._id]: e.target.value })}>
                    <option value="">Talla…</option>
                    {p.tallas.map((t) => <option key={t}>{t}</option>)}
                  </select>
                )}
                <p>
                  <button className="btn" disabled={p.stock < 1 || (p.tallas?.length > 0 && !tallas[p._id])} onClick={() => add(p, tallas[p._id])}>Añadir 🛒</button>
                </p>
              </div>
            ))}
          </div>
        </div>
        <aside className="card">
          <h3>Mi pedido</h3>
          {!lineas.length && <p>El carrito está vacío.</p>}
          {lineas.map((l, i) => (
            <p key={i}>{l.cantidad} × {l.nombre} {l.talla && `(${l.talla})`} — {(l.precio * l.cantidad).toFixed(2)} €{' '}
              <button className="btn d" aria-label="Quitar" onClick={() => quitar(i)}>✕</button></p>
          ))}
          <p className="price">Total: {total.toFixed(2)} €</p>
          <button className="btn" disabled={!lineas.length} onClick={pedir}>Hacer pedido (recoger en local)</button>
        </aside>
      </div>
    </>
  );
}
