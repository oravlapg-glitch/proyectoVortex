import { useEffect, useState } from 'react';
import { apiGet } from '../api/api';
import CartPanel from '../components/CartPanel';
import { TIENDA_CATS } from '../data/vortex';
import Icon from '../components/Icon';
import ProductCard from '../components/ProductCard';
import SectionHead from '../components/SectionHead';

const CATS = [
  { v: '', txt: 'Todo', icon: 'star', color: 'violet' },
  { v: 'perifericos', txt: 'Periféricos', icon: 'keyboard', color: 'cyan' },
  { v: 'accesorios', txt: 'Accesorios', icon: 'box', color: 'lime' },
  { v: 'ropa', txt: 'Ropa', icon: 'shirt', color: 'violet' },
];

export default function Tienda() {
  const [prods, setProds] = useState([]);
  const [cat, setCat] = useState('');
  const [q, setQ] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // En "Todo" quito la comida, los bonos y los torneos: esos tienen su propia página
  const cargar = () =>
    apiGet(`/productos?categoria=${cat}&q=${encodeURIComponent(q)}`)
      .then((r) => { setProds(r.filter((p) => TIENDA_CATS.includes(p.categoria))); setError(''); })
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  useEffect(() => { cargar(); }, [cat, q]);

  return (
    <>
      <SectionHead tag="Tienda" titulo={<>EQUÍPATE PARA EL <span className="violet-txt">SIGUIENTE NIVEL</span></>}>
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
                <button key={c.v} className={'chip ac-' + c.color + (cat === c.v ? ' sel' : '')} onClick={() => setCat(c.v)}>
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
          <CartPanel alPedir={cargar} />
        </aside>
      </div>
    </>
  );
}
