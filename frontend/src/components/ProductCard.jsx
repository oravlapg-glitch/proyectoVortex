import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import Icon from './Icon';

// Icono y color de fondo según la categoría (los productos de ejemplo no traen imagen)
const ARTE = {
  ropa: { icon: 'shirt', color: 'violet' },
  perifericos: { icon: 'keyboard', color: 'cyan' },
  accesorios: { icon: 'box', color: 'lime' },
};

export function ProductArt({ p }) {
  const a = ARTE[p.categoria] || { icon: 'box', color: 'violet' };
  if (p.imagen) return <div className="art"><img src={p.imagen} alt={p.nombre} /></div>;
  return <div className={'art ' + a.color}><Icon name={a.icon} size={56} /></div>;
}

export default function ProductCard({ p }) {
  const { add } = useCart();
  const toast = useToast();
  const [talla, setTalla] = useState('');
  const agotado = p.stock < 1;
  const necesitaTalla = p.tallas?.length > 0;

  const anadir = () => { add(p, talla || undefined); toast(`${p.nombre}${talla ? ' (' + talla + ')' : ''} añadido al carrito`); };

  return (
    <article className="pcard">
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
        <button className="cart-btn" aria-label={'Añadir ' + p.nombre} title={necesitaTalla && !talla ? 'Elige una talla' : 'Añadir al carrito'}
          disabled={agotado || (necesitaTalla && !talla)} onClick={anadir}>
          <Icon name="cart" size={18} />
        </button>
      </div>
    </article>
  );
}
