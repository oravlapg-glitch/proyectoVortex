import Icon from '../components/Icon';
import SectionHead from '../components/SectionHead';
import Espacios from './Espacios';
import { TARIFAS, ESPECIALES } from '../data/vortex';

// Página de Gaming: bonos (informativos) + lista de PCs que sí se reservan contra el backend
export default function Gaming() {
  return (
    <>
      <SectionHead tag="Tarifas gaming" titulo={<>ELIGE TU PLAN Y <span className="lime">JUEGA SIN LÍMITES</span></>}>
        Paga por hora o ahorra con bonos. Los bonos y abonos se activan en recepción.
      </SectionHead>

      <div className="plans wide">
        {TARIFAS.map((t) => (
          <div key={t.id} className={'plan' + (t.top ? ' top' : '')}>
            {t.top && <span className="plan-badge"><Icon name="star" size={12} /> Más popular</span>}
            <span className="tag">{t.titulo}</span>
            <p className="plan-price">{t.precio.toFixed(2).replace('.', ',')} €</p>
            <p className={t.id === '1h' ? 'muted small' : 'lime small'}>{t.nota}</p>
            <ul>{t.items.map((i) => <li key={i}><Icon name="check" size={14} />{i}</li>)}</ul>
          </div>
        ))}
      </div>

      <h2 className="sec-title">Tarifas <span className="cyan">especiales</span></h2>
      <div className="grid">
        {ESPECIALES.map((e) => (
          <div key={e.titulo} className="card feature">
            <span className="qi"><Icon name={e.icon} /></span>
            <h3>{e.titulo}</h3>
            <p className="muted">{e.texto}</p>
            <p className="price">{e.precio.toFixed(2)} €</p>
          </div>
        ))}
      </div>

      <Espacios tipo="pc" embebido />
    </>
  );
}
