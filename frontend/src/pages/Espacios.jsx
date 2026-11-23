import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGet, apiPost } from '../api/api';
import { useAuth } from '../context/AuthContext';

// Lista los PCs (tipo="pc") o las salas (tipo="sala") y deja reservar
export default function Espacios({ tipo }) {
  const [lista, setLista] = useState([]);
  const [error, setError] = useState('');
  const [abierto, setAbierto] = useState(null);

  useEffect(() => {
    setAbierto(null);
    apiGet(`/espacios?tipo=${tipo}&limit=50`).then((r) => setLista(r.datos)).catch((e) => setError(e.message));
  }, [tipo]);

  return (
    <>
      <h1>{tipo === 'pc' ? <>Gaming <span className="lime">PCs</span></> : <>Salas <span className="lime">privadas</span></>}</h1>
      {error && <p className="err">{error}</p>}
      <div className="grid">
        {lista.map((e) => (
          <div className="card" key={e._id}>
            <span className="tag">{e.tipo}</span>
            <h3>{e.nombre}</h3>
            <p>👥 {e.capacidad} · {e.specs.join(' · ')}</p>
            <p className="price">{e.precioHora.toFixed(2)} €/h</p>
            <button className="btn" onClick={() => setAbierto(abierto === e._id ? null : e._id)}>Reservar</button>
          </div>
        ))}
      </div>
      {abierto && <Reserva espacio={lista.find((e) => e._id === abierto)} />}
    </>
  );
}

function Reserva({ espacio }) {
  const { user } = useAuth();
  const nav = useNavigate();
  const hoy = new Date().toLocaleDateString('sv-SE'); // fecha local AAAA-MM-DD
  const [fecha, setFecha] = useState(hoy);
  const [franjas, setFranjas] = useState([]);
  const [inicio, setInicio] = useState(null);
  const [horas, setHoras] = useState(1);
  const [msg, setMsg] = useState(null);

  const cargar = () =>
    apiGet(`/reservas/disponibilidad?espacio=${espacio._id}&fecha=${fecha}`)
      .then((r) => { setFranjas(r.franjas); setInicio(null); setHoras(1); })
      .catch((e) => setMsg({ err: e.message }));
  useEffect(() => { cargar(); }, [fecha, espacio._id]);

  const libre = (h) => franjas.find((f) => f.hora === h)?.libre;
  let max = 0; // cuántas horas seguidas puedo coger desde la hora elegida (máximo 4)
  while (inicio !== null && max < 4 && libre(inicio + max)) max++;
  const h = Math.min(horas, max || 1);

  const reservar = async () => {
    if (!user) return nav('/login');
    try {
      await apiPost('/reservas', { espacio: espacio._id, fecha, horaInicio: inicio, horas: h });
      setMsg({ ok: '¡Reserva confirmada! Puedes verla en Mi cuenta.' });
      cargar();
    } catch (e) { setMsg({ err: e.message }); }
  };

  return (
    <section className="card" style={{ marginTop: 20 }}>
      <h2>Reservar {espacio.nombre}</h2>
      <label htmlFor="fecha">Fecha</label>
      <input id="fecha" type="date" min={hoy} value={fecha} onChange={(e) => { setMsg(null); setFecha(e.target.value); }} />
      <label>Hora de inicio (abrimos de 10:00 a 23:00)</label>
      <div className="slots">
        {franjas.map((f) => (
          <button key={f.hora} className={inicio === f.hora ? 'sel' : ''} disabled={!f.libre || (fecha === hoy && f.hora <= new Date().getHours())} onClick={() => setInicio(f.hora)}>
            {f.hora}:00
          </button>
        ))}
      </div>
      {inicio !== null && (
        <>
          <label htmlFor="horas">Horas</label>
          <select id="horas" value={h} onChange={(e) => setHoras(Number(e.target.value))}>
            {Array.from({ length: max }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <p className="price">Total: {(espacio.precioHora * h).toFixed(2)} €</p>
          <button className="btn" onClick={reservar}>Confirmar reserva →</button>
        </>
      )}
      {msg?.err && <p className="err">{msg.err}</p>}
      {msg?.ok && <p className="ok">{msg.ok}</p>}
    </section>
  );
}
