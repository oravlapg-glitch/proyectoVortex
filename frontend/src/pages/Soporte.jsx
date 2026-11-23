import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiGet, apiPost } from '../api/api';
import { useAuth } from '../context/AuthContext';
import Icon from '../components/Icon';
import SectionHead from '../components/SectionHead';

export default function Soporte() {
  const { user } = useAuth();
  const puedeCrear = user.rol !== 'AGENTE'; // el backend solo deja abrir tickets a CLIENTE y ADMIN
  const [tickets, setTickets] = useState([]);
  const [filtro, setFiltro] = useState({ estado: '', prioridad: '', agente: '' });
  const [agentes, setAgentes] = useState([]);
  const [cats, setCats] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [f, setF] = useState({ asunto: '', descripcion: '', categoria: '', pedido: '' });
  const [msg, setMsg] = useState(null);

  const cargar = () => {
    const p = new URLSearchParams();
    Object.entries(filtro).forEach(([k, v]) => v && p.set(k, v));
    apiGet('/tickets?' + p).then(setTickets).catch((e) => setMsg({ err: e.message }));
  };
  useEffect(cargar, [filtro]);

  useEffect(() => {
    if (puedeCrear) {
      apiGet('/categorias').then((c) => setCats(c.filter((x) => x.activa))).catch(() => {});
      apiGet('/pedidos?estado=recogido').then(setPedidos).catch(() => {});
    }
    if (user.rol === 'ADMIN') apiGet('/usuarios?rol=AGENTE').then(setAgentes).catch(() => {});
  }, []);

  const crear = async (e) => {
    e.preventDefault();
    try {
      await apiPost('/tickets', { ...f, pedido: f.pedido || undefined });
      setF({ asunto: '', descripcion: '', categoria: '', pedido: '' });
      setMsg({ ok: 'Ticket creado.' });
      cargar();
    } catch (err) { setMsg({ err: err.message }); }
  };
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const fil = (k) => (e) => setFiltro({ ...filtro, [k]: e.target.value });

  return (
    <>
      <SectionHead tag="Centro de ayuda" titulo={<>SOPORTE <span className="lime">VORTEX</span></>}>
        ¿Problemas con una reserva, un pedido o tu cuenta? Abre un ticket y te respondemos lo antes posible.
      </SectionHead>
      {msg?.err && <p className="err">{msg.err}</p>}
      {msg?.ok && <p className="ok">{msg.ok}</p>}

      {puedeCrear && (
        <form className="card" onSubmit={crear}>
          <h3><Icon name="ticket" /> Abrir un ticket</h3>
          <label htmlFor="as">Asunto</label>
          <input id="as" value={f.asunto} maxLength={120} onChange={set('asunto')} required />
          <label htmlFor="ds">Descripción</label>
          <textarea id="ds" rows={3} value={f.descripcion} onChange={set('descripcion')} required />
          <div className="row">
            <div>
              <label htmlFor="ct">Categoría</label>
              <select id="ct" value={f.categoria} onChange={set('categoria')} required>
                <option value="">Elige…</option>
                {cats.map((c) => <option key={c._id} value={c._id}>{c.nombre}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="pd">Pedido (solo reclamaciones)</label>
              <select id="pd" value={f.pedido} onChange={set('pedido')}>
                <option value="">Ninguno</option>
                {pedidos.map((p) => <option key={p._id} value={p._id}>{p.codigo}</option>)}
              </select>
            </div>
          </div>
          <p><button className="btn">Enviar ticket <Icon name="arrow" size={18} /></button></p>
        </form>
      )}

      <h2 className="sec-title">{user.rol === 'CLIENTE' ? 'Mis tickets' : user.rol === 'AGENTE' ? 'Tickets asignados' : 'Todos los tickets'}</h2>
      <div className="row filters">
        <select aria-label="Estado" value={filtro.estado} onChange={fil('estado')}>
          <option value="">Todos los estados</option>
          {['abierto', 'en_curso', 'pendiente_cliente', 'resuelto', 'cerrado'].map((s) => <option key={s}>{s}</option>)}
        </select>
        <select aria-label="Prioridad" value={filtro.prioridad} onChange={fil('prioridad')}>
          <option value="">Todas las prioridades</option>
          {['baja', 'media', 'alta'].map((s) => <option key={s}>{s}</option>)}
        </select>
        {user.rol === 'ADMIN' && (
          <select aria-label="Agente" value={filtro.agente} onChange={fil('agente')}>
            <option value="">Todos los agentes</option>
            <option value="sin_asignar">Sin asignar</option>
            {agentes.map((a) => <option key={a._id} value={a._id}>{a.nombre}</option>)}
          </select>
        )}
      </div>
      <div className="table-card">
      <table>
        <thead><tr><th>Código</th><th>Asunto</th><th>Categoría</th><th>Prioridad</th><th>Estado</th><th>Agente</th></tr></thead>
        <tbody>
          {tickets.map((t) => (
            <tr key={t._id}>
              <td><Link className="code" to={'/soporte/' + t._id}>{t.codigo}</Link></td>
              <td>{t.asunto}{user.rol !== 'CLIENTE' && ` · ${t.cliente?.nombre}`}</td>
              <td>{t.categoria?.nombre}</td>
              <td><span className={'pill ' + t.prioridad}>{t.prioridad}</span></td>
              <td><span className={'pill ' + t.estado}>{t.estado}</span></td>
              <td>{t.agente?.nombre || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!tickets.length && <div className="empty sm"><p>No hay tickets con estos filtros.</p></div>}
      </div>
    </>
  );
}
