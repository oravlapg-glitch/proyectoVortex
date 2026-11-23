import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiGet, apiPut, apiPatch } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Icon from '../components/Icon';

// Siguiente estado de un pedido (lo repito solo para pintar botones; el backend lo valida)
const SIG = { pendiente: ['listo', 'cancelado'], listo: ['recogido', 'cancelado'] };

export default function Dashboard() {
  const { user, setUser } = useAuth();
  const toast = useToast();
  const [nombre, setNombre] = useState(user.nombre);
  const [reservas, setReservas] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const esCliente = user.rol === 'CLIENTE';

  const cargar = () => {
    apiGet('/reservas').then(setReservas).catch((e) => toast(e.message, 'err'));
    apiGet('/pedidos').then(setPedidos).catch((e) => toast(e.message, 'err'));
  };
  useEffect(cargar, []);

  const accion = async (fn, ok) => {
    try { await fn(); toast(ok); cargar(); } catch (e) { toast(e.message, 'err'); }
  };

  const guardar = async (e) => {
    e.preventDefault();
    try {
      const u = await apiPut('/usuarios/me', { nombre });
      const nuevo = { ...user, nombre: u.nombre };
      localStorage.setItem('user', JSON.stringify(nuevo));
      setUser(nuevo);
      toast('Datos guardados.');
    } catch (err) { toast(err.message, 'err'); }
  };

  const activas = reservas.filter((r) => r.estado === 'confirmada').length;
  const pendientes = pedidos.filter((p) => p.estado === 'pendiente' || p.estado === 'listo').length;
  const gastado = [...reservas, ...pedidos].filter((x) => !String(x.estado).startsWith('cancel'))
    .reduce((s, x) => s + (x.precioTotal ?? x.total ?? 0), 0);

  return (
    <>
      <section className="profile">
        <span className="avatar xl">{user.nombre?.[0]?.toUpperCase()}</span>
        <div className="grow">
          <span className="tag">{esCliente ? 'Mi cuenta' : 'Gestión'}</span>
          <h1>Hola, <span className="lime">{user.nombre}</span></h1>
          <p className="muted">{user.email} · <span className="pill">{user.rol}</span></p>
        </div>
        <Link to="/soporte" className="btn o"><Icon name="chat" size={18} /> Soporte</Link>
      </section>

      <div className="stats">
        <div className="stat"><Icon name="calendar" /><span><small>Reservas activas</small><b>{activas}</b></span></div>
        <div className="stat"><Icon name="box" /><span><small>Pedidos en curso</small><b>{pendientes}</b></span></div>
        <div className="stat"><Icon name="chart" /><span><small>{esCliente ? 'Total gastado' : 'Total movido'}</small><b>{gastado.toFixed(2)} €</b></span></div>
      </div>

      <form className="card" onSubmit={guardar}>
        <h3><Icon name="user" /> Mis datos</h3>
        <div className="row">
          <div><label htmlFor="n">Nombre</label><input id="n" value={nombre} onChange={(e) => setNombre(e.target.value)} required /></div>
          <div><label htmlFor="em">Email</label><input id="em" value={user.email} disabled /></div>
          <div className="row-btn"><button className="btn">Guardar</button></div>
        </div>
      </form>

      <h2 className="sec-title">Reservas</h2>
      <div className="table-card">
        <table>
          <thead><tr><th>Espacio</th><th>Fecha</th><th>Horario</th><th>Total</th><th>Estado</th><th></th></tr></thead>
          <tbody>
            {reservas.map((r) => (
              <tr key={r._id}>
                <td><b>{r.espacio?.nombre}</b>{!esCliente && <small className="muted"> · {r.cliente?.nombre}</small>}</td>
                <td>{r.fecha}</td>
                <td>{r.horaInicio}:00 - {r.horaFin}:00</td><td>{r.precioTotal.toFixed(2)} €</td>
                <td><span className={'pill ' + r.estado}>{r.estado}</span></td>
                <td>{r.estado === 'confirmada' && user.rol !== 'AGENTE' && <button className="btn d sm" onClick={() => accion(() => apiPatch(`/reservas/${r._id}/cancelar`), 'Reserva cancelada.')}>Cancelar</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!reservas.length && <div className="empty sm"><p>No hay reservas.</p><Link to="/salas">Reservar ahora →</Link></div>}
      </div>

      <h2 className="sec-title">Pedidos</h2>
      <div className="table-card">
        <table>
          <thead><tr><th>Código</th><th>Productos</th><th>Total</th><th>Estado</th><th></th></tr></thead>
          <tbody>
            {pedidos.map((p) => (
              <tr key={p._id}>
                <td><b>{p.codigo}</b>{!esCliente && <small className="muted"> · {p.cliente?.nombre}</small>}</td>
                <td>{p.lineas.map((l) => `${l.cantidad}× ${l.nombre}${l.talla ? ' ' + l.talla : ''}`).join(', ')}</td>
                <td>{p.total.toFixed(2)} €</td>
                <td><span className={'pill ' + p.estado}>{p.estado}</span></td>
                <td className="actions">
                  {(esCliente ? (p.estado === 'pendiente' ? ['cancelado'] : []) : SIG[p.estado] || []).map((s) => (
                    <button key={s} className={'btn sm ' + (s === 'cancelado' ? 'd' : '')} onClick={() => accion(() => apiPatch(`/pedidos/${p._id}/estado`, { estado: s }), `Pedido ${p.codigo}: ${s}.`)}>{s}</button>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!pedidos.length && <div className="empty sm"><p>No hay pedidos.</p><Link to="/tienda">Ir a la tienda →</Link></div>}
      </div>
    </>
  );
}
