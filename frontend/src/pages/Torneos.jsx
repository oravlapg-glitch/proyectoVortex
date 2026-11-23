import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import SectionHead from '../components/SectionHead';
import { TORNEOS, RANKING, EVENTOS } from '../data/vortex';

export default function Torneos() {
  return (
    <>
      <SectionHead tag="Torneos y experiencias" titulo={<>COMPITE, DEMUESTRA, <span className="lime">GANA</span></>}>
        Torneos semanales, ligas y eventos especiales. Las inscripciones se hacen en recepción.
      </SectionHead>

      <div className="two">
        <div className="grid one">
          {TORNEOS.map((t) => (
            <div key={t.juego} className="card torneo">
              <span className="qi big"><Icon name="trophy" size={28} /></span>
              <div className="grow">
                <span className={'pill ' + (t.estado === 'en curso' ? 'live' : '')}>{t.estado}</span>
                <h3>{t.juego}</h3>
                <p className="muted small"><Icon name="calendar" size={14} /> {t.fecha} · <Icon name="users" size={14} /> {t.plazas}</p>
              </div>
              <div className="right">
                <small className="muted">Premio</small>
                <b className="lime">{t.premio}</b>
              </div>
            </div>
          ))}
        </div>
        <div className="board">
          <div className="board-head">
            <span><span className="tag">Ranking</span><b>{TORNEOS[0].juego}</b></span>
            <span className="pill live">En curso</span>
          </div>
          <ol>
            {RANKING.map((r, i) => (
              <li key={r.nick}><span className="pos">{i + 1}</span><span className="avatar sm">{r.nick[0]}</span>{r.nick}<b>{r.pts} pts</b></li>
            ))}
          </ol>
        </div>
      </div>

      <h2 className="sec-title">Eventos <span className="cyan">y celebraciones</span></h2>
      <div className="grid">
        {EVENTOS.map((e) => (
          <div key={e.titulo} className="card feature">
            <span className="qi"><Icon name={e.icon} /></span>
            <h3>{e.titulo}</h3>
            <p className="muted">{e.texto}</p>
            <p><small className="muted">desde</small> <span className="price">{e.desde.toFixed(2)} €</span><small className="muted"> /persona</small></p>
          </div>
        ))}
      </div>
      <div className="cta">
        <div>
          <h3>¿Montamos tu evento?</h3>
          <p className="muted">Reserva una sala privada y cuéntanos qué necesitas en soporte.</p>
        </div>
        <Link to="/salas" className="btn">Reservar sala <Icon name="arrow" size={18} /></Link>
      </div>
    </>
  );
}
