import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiGet, apiPost, apiPatch } from '../api/api';
import { useAuth } from '../context/AuthContext';
import Icon from '../components/Icon';

const ESTADOS = ['abierto', 'en_curso', 'pendiente_cliente', 'resuelto', 'cerrado'];
// Estas transiciones las repito solo para decidir qué botones enseño; las valida el backend
const TRANS = {
  AGENTE: { abierto: ['en_curso'], en_curso: ['pendiente_cliente', 'resuelto'], pendiente_cliente: ['en_curso', 'resuelto'], resuelto: ['en_curso'] },
  CLIENTE: { resuelto: ['cerrado', 'en_curso'] },
};

export default function TicketDetalle() {
  const { id } = useParams();
  const { user } = useAuth();
  const [t, setT] = useState(null);
  const [texto, setTexto] = useState('');
  const [agentes, setAgentes] = useState([]);
  const [msg, setMsg] = useState(null);

  const cargar = () => apiGet('/tickets/' + id).then(setT).catch((e) => setMsg({ err: e.message }));
  useEffect(() => {
    cargar();
    if (user.rol === 'ADMIN') apiGet('/usuarios?rol=AGENTE').then(setAgentes).catch(() => {});
  }, [id]);

  const run = async (fn) => {
    try { await fn(); setMsg(null); cargar(); } catch (e) { setMsg({ err: e.message }); }
  };
  const responder = (e) => {
    e.preventDefault();
    run(async () => { await apiPost(`/tickets/${id}/mensajes`, { texto }); setTexto(''); });
  };

  if (!t) return msg ? <p className="err">{msg.err}</p> : <p>Cargando…</p>;
  const siguientes = user.rol === 'ADMIN' ? ESTADOS.filter((s) => s !== t.estado) : TRANS[user.rol]?.[t.estado] || [];
  const fecha = (d) => new Date(d).toLocaleString('es-ES');

  return (
    <>
      <p><Link to="/soporte" className="back"><Icon name="back" size={16} /> Volver a soporte</Link></p>
      <span className="tag">{t.codigo}</span>
      <h1 className="ticket-title">{t.asunto}</h1>
      <p className="pills"><span className={'pill ' + t.estado}>{t.estado}</span> <span className={'pill ' + t.prioridad}>{t.prioridad}</span> <span className="pill">{t.categoria?.nombre}</span></p>
      {msg?.err && <p className="err">{msg.err}</p>}
      <div className="two">
        <div>
          <div className="msg"><div className="msg-head"><span className="avatar sm">{t.cliente?.nombre?.[0]}</span><b>{t.cliente?.nombre}</b><small className="muted">cliente · {fecha(t.createdAt)}</small></div>{t.descripcion}</div>
          {t.pedido && <p className="pill">Pedido {t.pedido.codigo} · {t.pedido.total.toFixed(2)} €</p>}
          {t.mensajes.map((m, i) => (
            <div key={i} className={'msg' + (m.autor?.rol !== 'CLIENTE' ? ' staff' : '')}>
              <div className="msg-head"><span className="avatar sm">{m.autor?.nombre?.[0]}</span><b>{m.autor?.nombre}</b><small className="muted">{m.autor?.rol?.toLowerCase()} · {fecha(m.fecha)}</small></div>{m.texto}
            </div>
          ))}
          {t.estado !== 'cerrado' && (
            <form onSubmit={responder} className="card reply">
              <label htmlFor="resp">Tu respuesta</label>
              <textarea id="resp" rows={3} value={texto} onChange={(e) => setTexto(e.target.value)} required />
              <p><button className="btn">Responder <Icon name="arrow" size={18} /></button></p>
            </form>
          )}
        </div>
        <aside className="card sticky">
          <h3>Cliente: {t.cliente?.nombre}</h3>
          <p>Agente: {t.agente?.nombre || 'sin asignar'}</p>
          {siguientes.length > 0 && <p><b>Cambiar estado</b></p>}
          <div className="row">
            {siguientes.map((s) => <button key={s} className="btn v" onClick={() => run(() => apiPatch(`/tickets/${id}/estado`, { estado: s }))}>{s}</button>)}
          </div>
          {user.rol !== 'CLIENTE' && (
            <>
              <label htmlFor="pr">Prioridad</label>
              <select id="pr" value={t.prioridad} onChange={(e) => run(() => apiPatch(`/tickets/${id}/prioridad`, { prioridad: e.target.value }))}>
                {['baja', 'media', 'alta'].map((p) => <option key={p}>{p}</option>)}
              </select>
            </>
          )}
          {user.rol === 'ADMIN' && (
            <>
              <label htmlFor="ag">Asignar a agente</label>
              <select id="ag" value={t.agente?._id || ''} onChange={(e) => run(() => apiPatch(`/tickets/${id}/asignar`, { agente: e.target.value }))}>
                <option value="" disabled>Elige…</option>
                {agentes.map((a) => <option key={a._id} value={a._id}>{a.nombre}</option>)}
              </select>
            </>
          )}
          <h3 className="mt">Historial</h3>
          {t.historial.map((h, i) => (
            <p key={i} className="small timeline">{fecha(h.fecha)} · {h.usuario?.nombre}: {h.de || 'nuevo'} → <b>{h.a}</b></p>
          ))}
        </aside>
      </div>
    </>
  );
}
