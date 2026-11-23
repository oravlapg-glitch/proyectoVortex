import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiGet } from '../api/api';
import Icon from '../components/Icon';
import AddButton from '../components/AddButton';
import SectionHead from '../components/SectionHead';
import { TORNEOS, EVENTO_ICON, RANKING } from '../data/vortex';

// Ranking del torneo en curso (lo uso también en el inicio)
export function Ranking({ titulo = 'Vortex Cup · Fútbol' }) {
  return (
    <div className="board">
      <div className="board-head">
        <span><span className="tag">Ranking</span><b>{titulo}</b></span>
        <span className="pill live">En curso</span>
      </div>
      <ol>
        {RANKING.map((r, i) => (
          <li key={r.nick}><span className="pos">{i + 1}</span><span className="avatar sm">{r.nick[0]}</span>{r.nick}<b>{r.pts} pts</b></li>
        ))}
      </ol>
    </div>
  );
}

export default function Torneos() {
  const [lista, setLista] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => { apiGet('/productos?categoria=torneos').then(setLista).catch((e) => setError(e.message)); }, []);

  const torneos = lista.filter((p) => TORNEOS[p.nombre]);
  const eventos = lista.filter((p) => !TORNEOS[p.nombre]);

  return (
    <>
      <SectionHead tag="Torneos y experiencias" titulo={<>COMPITE, DEMUESTRA, <span className="lime">GANA</span></>}>
        Apúntate desde aquí: añade la inscripción al carrito y haz el pedido. Las plazas son limitadas.
      </SectionHead>
      {error && <p className="err">{error}</p>}

      <div className="two">
        <div className="grid one">
          {torneos.map((p) => {
            const [fecha, plazas, premio] = (p.descripcion || '').split(' · ');
            return (
              <div key={p._id} className="card torneo">
                <span className="qi big"><Icon name="trophy" size={26} /></span>
                <div className="grow">
                  <span className={'pill ' + (TORNEOS[p.nombre].estado === 'en curso' ? 'live' : '')}>{TORNEOS[p.nombre].estado}</span>
                  <h3>{p.nombre.replace('Inscripción ', '')}</h3>
                  <p className="muted small"><Icon name="calendar" size={14} /> {fecha} · <Icon name="users" size={14} /> {plazas}</p>
                  {premio && <p className="small"><span className="cyan">{premio}</span></p>}
                </div>
                <div className="torneo-buy">
                  <span className="price">{p.precio.toFixed(2)} €</span>
                  <small className="muted">{p.stock} plazas libres</small>
                  <AddButton p={p} texto="Inscribirme" />
                </div>
              </div>
            );
          })}
          {!torneos.length && !error && <div className="empty"><Icon name="trophy" size={36} /><p>No hay torneos todavía.</p></div>}
        </div>
        <Ranking />
      </div>

      <h2 className="sec-title">Eventos <span className="cyan">y celebraciones</span></h2>
      <div className="grid">
        {eventos.map((p, i) => (
          <div key={p._id} className={'card feature ac-' + ['violet', 'cyan', 'lime'][i % 3]}>
            <span className="qi"><Icon name={EVENTO_ICON[p.nombre] || 'gift'} /></span>
            <h3>{p.nombre}</h3>
            <p className="muted">{p.descripcion}</p>
            <div className="pcard-foot">
              <span className="price">{p.precio.toFixed(2)} €</span>
              <AddButton p={p} texto="Reservar" />
            </div>
          </div>
        ))}
      </div>
      <div className="cta">
        <div>
          <h3>¿Necesitas también la sala?</h3>
          <p className="muted">Para cumpleaños y eventos, reserva una sala privada para el día que quieras.</p>
        </div>
        <Link to="/salas" className="btn v">Reservar sala <Icon name="arrow" size={18} /></Link>
      </div>
    </>
  );
}
