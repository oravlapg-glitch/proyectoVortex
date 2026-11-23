import { useState } from 'react';
import Foto, { slug } from './Foto';
import AddButton from './AddButton';

// Color de la tarjeta según la categoría
const ARTE = {
  ropa: { color: 'violet' },
  perifericos: { color: 'cyan' },
  accesorios: { color: 'lime' },
};

// Foto del producto: la del backend (campo imagen) o /img/productos/<nombre>.jpg
export function ProductArt({ p }) {
  const a = ARTE[p.categoria] || { color: 'violet' };
  return (
    <div className={'art ' + a.color}>
      <Foto key={p._id} src={p.imagen || `/img/productos/${slug(p.nombre)}.jpg`} alt={p.nombre} />
    </div>
  );
}

export default function ProductCard({ p }) {
  const [talla, setTalla] = useState('');
  const agotado = p.stock < 1;
  const necesitaTalla = p.tallas?.length > 0;

  return (
    <article className={'pcard ac-' + (ARTE[p.categoria]?.color || 'violet')}>
      {agotado ? <span className="flag red-bg">Agotado</span> : p.stock <= 5 && <span className="flag cyan-bg">Últimas {p.stock}</span>}
      <ProductArt p={p} />
      <span className="tag">{p.categoria}</span>
      <h3>{p.nombre}</h3>
      {necesitaTalla && (
        <div className="sizes" role="group" aria-label="Talla">
          {p.tallas.map((t) => (
            <button key={t} type="button" className={talla === t ? 'sel' : ''} onClick={() => setTalla(t)}>{t}</button>
          ))}
        </div>
      )}
      <div className="pcard-foot">
        <span className="price">{p.precio.toFixed(2)} €</span>
        <AddButton p={p} talla={talla || undefined} disabled={necesitaTalla && !talla} texto={necesitaTalla && !talla ? 'Elige talla' : 'Añadir'} />
      </div>
    </article>
  );
}
