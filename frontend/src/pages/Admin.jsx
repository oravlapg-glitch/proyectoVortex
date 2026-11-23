import { useEffect, useState } from 'react';
import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from '../api/api';
import Icon from '../components/Icon';
import SectionHead from '../components/SectionHead';

const TABS = [['metricas', 'chart'], ['usuarios', 'users'], ['productos', 'cart'], ['espacios', 'monitor'], ['datos', 'database']];

// Campos de cada CRUD: [nombre, tipo]. Si el tipo es un array, lo pinto como <select>
const CRUD = {
  productos: { lista: '/productos', campos: [['nombre', 'text'], ['categoria', ['ropa', 'perifericos', 'accesorios', 'comida', 'bebida', 'bonos', 'torneos']], ['descripcion', 'opt'], ['precio', 'number'], ['stock', 'number'], ['tallas', 'list']] },
  espacios: { lista: '/espacios/todos', campos: [['nombre', 'text'], ['tipo', ['pc', 'sala']], ['capacidad', 'number'], ['precioHora', 'number'], ['specs', 'list']] },
};

export default function Admin() {
  const [tab, setTab] = useState('metricas');
  return (
    <>
      <SectionHead tag="Panel de administración" titulo={<>BASE DE <span className="lime">DATOS</span></>}>
        Gestiona usuarios, productos, espacios y revisa las métricas de soporte.
      </SectionHead>
      <div className="chips big" role="tablist">
        {TABS.map(([t, ic]) => <button key={t} role="tab" aria-selected={tab === t} className={'chip' + (tab === t ? ' sel' : '')} onClick={() => setTab(t)}><Icon name={ic} size={16} />{t}</button>)}
      </div>
      {tab === 'metricas' && <Metricas />}
      {tab === 'usuarios' && <Usuarios />}
      {(tab === 'productos' || tab === 'espacios') && <Crud key={tab} tipo={tab} />}
      {tab === 'datos' && <Datos />}
    </>
  );
}

function Metricas() {
  const [m, setM] = useState(null);
  useEffect(() => { apiGet('/tickets/metricas').then(setM).catch(() => {}); }, []);
  if (!m) return <p>Cargando…</p>;
  return (
    <div className="stats">
      <div className="stat"><Icon name="ticket" /><span><small>Total tickets</small><b>{m.total}</b></span></div>
      <div className="stat danger"><Icon name="alert" /><span><small>Sin asignar</small><b>{m.sinAsignar}</b></span></div>
      {Object.entries(m.porEstado).map(([k, v]) => <div className="stat cyan" key={k}><Icon name="chart" /><span><small>{k}</small><b>{v}</b></span></div>)}
    </div>
  );
}

function Usuarios() {
  const [lista, setLista] = useState([]);
  const [msg, setMsg] = useState(null);
  const cargar = () => apiGet('/usuarios').then(setLista).catch((e) => setMsg(e.message));
  useEffect(() => { cargar(); }, []);
  const run = async (fn) => { try { await fn(); setMsg(null); cargar(); } catch (e) { setMsg(e.message); } };
  return (
    <>
      {msg && <p className="err">{msg}</p>}
      <div className="table-card">
      <table>
        <thead><tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Activo</th></tr></thead>
        <tbody>
          {lista.map((u) => (
            <tr key={u._id}>
              <td>{u.nombre}</td><td>{u.email}</td>
              <td><select aria-label="Rol" value={u.rol} onChange={(e) => run(() => apiPatch(`/usuarios/${u._id}/rol`, { rol: e.target.value }))}>
                {['CLIENTE', 'AGENTE', 'ADMIN'].map((r) => <option key={r}>{r}</option>)}</select></td>
              <td><button className={'btn sm ' + (u.activo ? '' : 'd')} onClick={() => run(() => apiPatch(`/usuarios/${u._id}/activo`, { activo: !u.activo }))}>{u.activo ? 'Activo' : 'Desactivado'}</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </>
  );
}

// Un solo CRUD que me sirve para productos y para espacios (crear, listar, editar y desactivar)
function Crud({ tipo }) {
  const cfg = CRUD[tipo];
  const vacio = Object.fromEntries(cfg.campos.map(([k]) => [k, '']));
  const [items, setItems] = useState([]);
  const [f, setF] = useState(vacio);
  const [edit, setEdit] = useState(null);
  const [msg, setMsg] = useState(null);

  const cargar = () => apiGet(cfg.lista).then(setItems).catch((e) => setMsg({ err: e.message }));
  useEffect(() => { cargar(); }, []);

  const body = () => Object.fromEntries(cfg.campos.map(([k, t]) => [k,
    t === 'number' ? Number(f[k]) : t === 'list' ? String(f[k]).split(',').map((s) => s.trim()).filter(Boolean) : f[k]]));

  const guardar = async (e) => {
    e.preventDefault();
    try {
      if (edit) await apiPut(`/${tipo}/${edit}`, body()); else await apiPost(`/${tipo}`, body());
      setMsg({ ok: edit ? 'Actualizado.' : 'Creado.' }); setF(vacio); setEdit(null); cargar();
    } catch (err) { setMsg({ err: err.message }); }
  };
  const editar = (it) => {
    setEdit(it._id);
    setF(Object.fromEntries(cfg.campos.map(([k, t]) => [k, t === 'list' ? (it[k] || []).join(', ') : it[k]])));
  };
  const borrar = async (id) => {
    try { await apiDelete(`/${tipo}/${id}`); cargar(); } catch (err) { setMsg({ err: err.message }); }
  };

  return (
    <>
      {msg?.err && <p className="err">{msg.err}</p>}
      {msg?.ok && <p className="ok">{msg.ok}</p>}
      <form className="card" onSubmit={guardar}>
        <h3><Icon name={edit ? 'check' : 'box'} /> {edit ? 'Editar' : 'Crear'} {tipo}</h3>
        <div className="row">
          {cfg.campos.map(([k, t]) => (
            <div key={k}>
              <label htmlFor={k}>{k}{t === 'list' && ' (separados por comas)'}</label>
              {Array.isArray(t) ? (
                <select id={k} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} required>
                  <option value="">Elige…</option>{t.map((o) => <option key={o}>{o}</option>)}
                </select>
              ) : (
                <input id={k} type={t === 'number' ? 'number' : 'text'} step="any" min={t === 'number' ? 0 : undefined} value={f[k] ?? ''} onChange={(e) => setF({ ...f, [k]: e.target.value })} required={t !== 'list' && t !== 'opt'} />
              )}
            </div>
          ))}
        </div>
        <p>
          <button className="btn">{edit ? 'Guardar cambios' : 'Crear'}</button>{' '}
          {edit && <button type="button" className="btn o" onClick={() => { setEdit(null); setF(vacio); }}>Cancelar</button>}
        </p>
      </form>
      <div className="table-card">
      <table>
        <thead><tr><th>Nombre</th><th>Tipo</th><th>Precio</th>{tipo === 'productos' && <th>Stock</th>}<th>Activo</th><th></th></tr></thead>
        <tbody>
          {items.map((it) => (
            <tr key={it._id}>
              <td>{it.nombre}</td><td><span className="pill">{it.categoria || it.tipo}</span></td>
              <td>{(it.precio ?? it.precioHora).toFixed(2)} €</td>
              {tipo === 'productos' && <td className={it.stock < 1 ? 'red' : ''}>{it.stock}</td>}
              <td><span className={'pill ' + (it.activo ? 'confirmada' : 'cancelada')}>{it.activo ? 'sí' : 'no'}</span></td>
              <td className="actions">
                <button className="btn v sm" onClick={() => editar(it)}>Editar</button>
                {it.activo && <button className="btn d sm" onClick={() => borrar(it._id)}>Desactivar</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </>
  );
}

// Botones que llaman a las rutas carga-inicial del backend (necesitan token de ADMIN)
function Datos() {
  const [msg, setMsg] = useState(null);
  const cargar = async (ruta) => {
    try { setMsg({ ok: await apiGet(`/${ruta}/carga-inicial`) }); } catch (e) { setMsg({ err: e.message }); }
  };
  return (
    <div className="card">
      <h3><Icon name="database" /> Datos de ejemplo</h3>
      <p className="muted">Cargo los datos de prueba del backend (no se duplican si ya existen). «productos» incluye la tienda, la carta, los bonos y los torneos.</p>
      <div className="row left">
        {['usuarios', 'espacios', 'categorias', 'productos'].map((r) => <button key={r} className="btn" onClick={() => cargar(r)}>Cargar {r}</button>)}
      </div>
      {msg?.err && <p className="err">{msg.err}</p>}
      {msg?.ok && <p className="ok">{msg.ok}</p>}
    </div>
  );
}
