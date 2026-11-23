import { useEffect, useState } from 'react';
import { apiGet } from '../api/api';
import Icon from '../components/Icon';
import AddButton from '../components/AddButton';
import SectionHead from '../components/SectionHead';
import Espacios from './Espacios';
import { BONOS } from '../data/vortex';

// Tarjeta de precio de un bono (la uso también en el inicio)
export function PlanCard({ p }) {
  const extra = BONOS[p.nombre] || {};
  return (
    <div className={'plan' + (extra.top ? ' top' : '')}>
      {extra.top && <span className="plan-badge"><Icon name="star" size={12} /> Más popular</span>}
      <span className="tag">{p.nombre}</span>
      <p className="plan-price">{p.precio.toFixed(2).replace('.', ',')} €</p>
      <p className="lime small">{p.descripcion}</p>
      <ul>{(extra.items || []).map((i) => <li key={i}><Icon name="check" size={14} />{i}</li>)}</ul>
      <AddButton p={p} texto="Comprar" />
    </div>
  );
}

// Página de Gaming: bonos que se compran con el carrito + PCs que se reservan por horas
export default function Gaming() {
  const [bonos, setBonos] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => { apiGet('/productos?categoria=bonos').then(setBonos).catch((e) => setError(e.message)); }, []);

  const planes = bonos.filter((b) => b.nombre.startsWith('Bono'));
  const especiales = bonos.filter((b) => !b.nombre.startsWith('Bono'));

  return (
    <>
      <SectionHead tag="Tarifas gaming" titulo={<>ELIGE TU PLAN Y <span className="lime">JUEGA SIN LÍMITES</span></>}>
        Reserva un PC por horas o compra un bono y ahorra. Los bonos se activan en recepción al recoger el pedido.
      </SectionHead>
      {error && <p className="err">{error}</p>}

      <div className="plans wide">
        <div className="plan hour">
          <span className="tag">Pago por hora</span>
          <p className="plan-price">Por horas</p>
          <p className="muted small">Elige PC, día y hora</p>
          <ul><li><Icon name="check" size={14} />PC Gaming</li><li><Icon name="check" size={14} />Hasta 4 horas seguidas</li></ul>
          <a href="#reservar" className="btn v sm">Reservar PC</a>
        </div>
        {planes.map((p) => <PlanCard key={p._id} p={p} />)}
      </div>

      {especiales.length > 0 && <h2 className="sec-title">Tarifas <span className="cyan">especiales</span></h2>}
      <div className="grid">
        {especiales.map((p, i) => (
          <div key={p._id} className={'card feature ac-' + ['cyan', 'violet', 'lime'][i % 3]}>
            <span className="qi"><Icon name={BONOS[p.nombre]?.icon || 'star'} /></span>
            <h3>{p.nombre}</h3>
            <p className="muted">{p.descripcion}</p>
            <div className="pcard-foot">
              <span className="price">{p.precio.toFixed(2)} €</span>
              <AddButton p={p} texto="Comprar" />
            </div>
          </div>
        ))}
      </div>

      <div id="reservar"><Espacios tipo="pc" embebido /></div>
    </>
  );
}
