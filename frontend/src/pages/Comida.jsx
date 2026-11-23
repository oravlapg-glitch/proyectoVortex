import { useState } from 'react';
import Icon from '../components/Icon';
import SectionHead from '../components/SectionHead';
import { CARTA, MENU_ESPECIAL } from '../data/vortex';

export default function Comida() {
  const [tab, setTab] = useState('comida');

  return (
    <>
      <SectionHead tag="Comida & bebida" titulo={<>RECARGA ENERGÍA, <span className="lime">SIGUE JUGANDO</span></>}>
        Pide en barra o desde tu puesto: te lo llevamos al PC o a tu sala.
      </SectionHead>

      <div className="menu-hero">
        <div>
          <span className="tag lime">{MENU_ESPECIAL.titulo}</span>
          <h2>BURGER + BEBIDA + SNACK</h2>
          <p className="muted">El combo favorito de nuestros jugadores para aguantar la partida.</p>
          <p className="plan-price lime">{MENU_ESPECIAL.precio.toFixed(2).replace('.', ',')} €</p>
        </div>
        <span className="menu-emoji" aria-hidden="true">🍔🥤🍟</span>
      </div>

      <div className="chips big" role="tablist">
        <button role="tab" aria-selected={tab === 'comida'} className={'chip' + (tab === 'comida' ? ' sel' : '')} onClick={() => setTab('comida')}><Icon name="food" size={16} />Comida</button>
        <button role="tab" aria-selected={tab === 'bebidas'} className={'chip' + (tab === 'bebidas' ? ' sel' : '')} onClick={() => setTab('bebidas')}><Icon name="bolt" size={16} />Bebidas</button>
      </div>

      <div className="grid">
        {CARTA[tab].map((c) => (
          <div key={c.nombre} className="food row-card">
            <span className="food-emoji">{c.emoji}</span>
            <div className="grow">
              <b>{c.nombre}</b>
              <p className="muted small">{c.desc}</p>
            </div>
            <span className="price">{c.precio.toFixed(2)} €</span>
          </div>
        ))}
      </div>
    </>
  );
}
