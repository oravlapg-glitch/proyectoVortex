import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiGet, apiPut, apiPatch } from '../api/api';
import { useAuth } from '../context/AuthContext';

// Siguiente estado de un pedido (lo repito solo para pintar botones; el backend lo valida)
const SIG = { pendiente: ['listo', 'cancelado'], listo: ['recogido', 'cancelado'] };

export default function Dashboard() {
  const { user, setUser } = useAuth();
  const [nombre, setNombre] = useState(user.nombre);
  const [reservas, setReservas] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [msg, setMsg] = useState(null);
  const esCliente = user.rol === 'CLIENTE';

  const cargar = () => {
    apiGet('/reservas').then(setReservas).catch((e) => setMsg({ err: e.message }));
    apiGet('/pedidos').then(setPedidos).catch((e) => setMsg({ err: e.message }));
  };
  useEffect(cargar, []);

  const accion = async (fn) => {
    try { await fn(); setMsg(null); cargar(); } catch (e) { setMsg({ err: e.message }); }
  };

  const guardar = async (e) => {
    e.preventDefault();
    try {
      const u = await apiPut('/usuarios/me', { nombre });
      const nuevo = { ...user, nombre: u.nombre };
      localStorage.setItem('user', JSON.stringify(nuevo));
      setUser(nuevo);
      setMsg({ ok: 'Datos guardados.' });
    } catch (err) { setMsg({ err: err.message }); }
  };

  return (
    <>
      <h1>{esCliente ? 'Mi' : 'Gestión de'} <span className="lime">cuenta</span></h1>
      {msg?.err && <p className="err">{msg.err}</p>}
      {msg?.ok && <p className="ok">{msg.ok}</p>}
      <form className="card" onSubmit={guardar}>
        <div className="row">
          <div><label htmlFor="n">Nombre</label><input id="n" value={nombre} onChange={(e) => setNombre(e.target.value)} required /></div>
          <div><label>Email</label><input value={user.email} disabled /></div>
          <div><label>&nbsp;</label><button className="btn">Guardar</button></div>
        </div>
        <p>¿Algún problema? <Link to="/soporte">Abre un ticket de soporte</Link></p>
      </form>

      <h2>Reservas</h2>
      <table>
        <thead><tr><th>Espacio</th><th>Fecha</th><th>Horario</th><th>Total</th><th>Estado</th><th></th></tr></thead>
        <tbody>
          {reservas.map((r) => (
            <tr key={r._id}>
              <td>{r.espacio?.nombre}{!esCliente && ` · ${r.cliente?.nombre}`}</td><td>{r.fecha}</td>
              <td>{r.horaInicio}:00 - {r.horaFin}:00</td><td>{r.precioTotal.toFixed(2)} €</td>
              <td><span className={'pill ' + r.estado}>{r.estado}</span></td>
              <td>{r.estado === 'confirmada' && user.rol !== 'AGENTE' && <button className="btn d" onClick={() => accion(() => apiPatch(`/reservas/${r._id}/cancelar`))}>Cancelar</button>}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!reservas.length && <p>No hay reservas.</p>}

      <h2>Pedidos</h2>
      <table>
        <thead><tr><th>Código</th><th>Productos</th><th>Total</th><th>Estado</th><th></th></tr></thead>
        <tbody>
          {pedidos.map((p) => (
            <tr key={p._id}>
              <td>{p.codigo}{!esCliente && ` · ${p.cliente?.nombre}`}</td>
              <td>{p.lineas.map((l) => `${l.cantidad}× ${l.nombre}${l.talla ? ' ' + l.talla : ''}`).join(', ')}</td>
              <td>{p.total.toFixed(2)} €</td>
              <td><span className={'pill ' + p.estado}>{p.estado}</span></td>
              <td className="row">
                {(esCliente ? (p.estado === 'pendiente' ? ['cancelado'] : []) : SIG[p.estado] || []).map((s) => (
                  <button key={s} className={s === 'cancelado' ? 'btn d' : 'btn'} onClick={() => accion(() => apiPatch(`/pedidos/${p._id}/estado`, { estado: s }))}>{s}</button>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!pedidos.length && <p>No hay pedidos.</p>}
    </>
  );
}
