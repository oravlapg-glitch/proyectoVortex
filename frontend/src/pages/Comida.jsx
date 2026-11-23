import { useEffect, useState } from 'react';
import { apiGet } from '../api/api';
import Icon from '../components/Icon';
import Foto, { slug } from '../components/Foto';
import AddButton from '../components/AddButton';
import SectionHead from '../components/SectionHead';

const MENU = 'Menú especial Gamers';

// Tarjeta de un plato o bebida: foto arriba, nombre y descripción, y abajo el precio y el botón de añadir
export function FoodCard({ p, sinDesc }) {
  return (
    <article className={'food ac-' + (p.categoria === 'bebida' ? 'cyan' : 'violet')}>
      <div className="food-img">
        <Foto key={p._id} src={p.imagen || `/img/comida/${slug(p.nombre)}.jpg`} alt={p.nombre} />
      </div>
      <div className="food-body">
        <span className="tag">{p.categoria}</span>
        <h3>{p.nombre}</h3>
        {!sinDesc && p.descripcion && <p className="muted small">{p.descripcion}</p>}
        <div className="pcard-foot">
          <span className="price">{p.precio.toFixed(2)} €</span>
          <AddButton p={p} />
        </div>
      </div>
    </article>
  );
}

export default function Comida() {
  const [tab, setTab] = useState('comida');
  const [lista, setLista] = useState([]);
  const [menu, setMenu] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiGet(`/productos?categoria=${tab}`)
      .then((r) => {
        setLista(r.filter((p) => p.nombre !== MENU));
        if (tab === 'comida') setMenu(r.find((p) => p.nombre === MENU) || null);
        setError('');
      })
      .catch((e) => setError(e.message));
  }, [tab]);

  return (
    <>
      <SectionHead tag="Comida & bebida" titulo={<>RECARGA ENERGÍA, <span className="cyan">SIGUE JUGANDO</span></>}>
        Añádelo al carrito y haz el pedido: te lo llevamos a tu PC o a tu sala.
      </SectionHead>
      {error && <p className="err">{error}</p>}

      {menu && (
        <div className="menu-hero">
          <div className="menu-hero-img">
            <Foto src={menu.imagen || '/img/comida/menu-gamers.jpg'} alt={menu.nombre} />
          </div>
          <div>
            <span className="tag lime">{menu.nombre}</span>
            <h2>{menu.descripcion.toUpperCase()}</h2>
            <p className="muted">El combo favorito de nuestros jugadores para aguantar la partida.</p>
            <div className="row left">
              <span className="price big">{menu.precio.toFixed(2)} €</span>
              <AddButton p={menu} texto="Pedir menú" />
            </div>
          </div>
        </div>
      )}

      <div className="chips big" role="tablist">
        <button role="tab" aria-selected={tab === 'comida'} className={'chip ac-violet' + (tab === 'comida' ? ' sel' : '')} onClick={() => setTab('comida')}><Icon name="food" size={16} />Comida</button>
        <button role="tab" aria-selected={tab === 'bebida'} className={'chip ac-cyan' + (tab === 'bebida' ? ' sel' : '')} onClick={() => setTab('bebida')}><Icon name="bolt" size={16} />Bebidas</button>
      </div>

      <div className="grid">
        {lista.map((p) => <FoodCard key={p._id} p={p} />)}
      </div>
      {!lista.length && !error && <div className="empty"><Icon name="food" size={36} /><p>Todavía no hay carta. El admin puede cargarla en Base de datos → Datos.</p></div>}
    </>
  );
}
