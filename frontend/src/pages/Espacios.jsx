import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGet, apiPost } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Icon from '../components/Icon';
import SectionHead from '../components/SectionHead';
import Foto, { slug } from '../components/Foto';

// Lista los PCs (tipo="pc") o las salas (tipo="sala") y deja reservar.
// "embebido" = la uso dentro de la página Gaming, así que no pinto la cabecera grande
export default function Espacios({ tipo, embebido }) {
  const [lista, setLista] = useState([]);
  const [error, setError] = useState('');
  const [abierto, setAbierto] = useState(null);
  const esPc = tipo === 'pc';

  useEffect(() => {
    setAbierto(null);
    apiGet(`/espacios?tipo=${tipo}&limit=50`).then((r) => setLista(r.datos)).catch((e) => setError(e.message));
  }, [tipo]);

  const elegido = lista.find((e) => e._id === abierto);

  return (
    <>
      {embebido ? (
        <h2 className="sec-title">Reserva tu <span className="lime">PC</span></h2>
      ) : (
        <SectionHead tag="Salas privadas" titulo={<>TU EQUIPO, <span className="lime">TU ESPACIO</span></>}>
          Salas privadas para grupos, cumpleaños, torneos y streaming. Elige sala, día y hora.
        </SectionHead>
      )}
      {error && <p className="err">{error}</p>}

      <div className="grid">
        {lista.map((e) => (
          <article className={'space' + (abierto === e._id ? ' sel' : '')} key={e._id}>
            <div className={'space-art ' + (esPc ? 'pc' : 'sala')}>
              <Foto src={e.imagen || `/img/espacios/${slug(e.nombre)}.jpg`} alt={e.nombre} />
              <span className="space-cap"><Icon name="users" size={14} /> {e.capacidad}</span>
            </div>
            <div className="space-body">
              <h3>{e.nombre}</h3>
              {e.descripcion && <p className="muted small">{e.descripcion}</p>}
              <div className="specs">{e.specs.map((s) => <span key={s}>{s}</span>)}</div>
              <div className="pcard-foot">
                <span className="price">{e.precioHora.toFixed(2)} €<small>/h</small></span>
                <button className={'btn sm' + (abierto === e._id ? ' v' : '')} onClick={() => setAbierto(abierto === e._id ? null : e._id)}>
                  {abierto === e._id ? 'Cerrar' : 'Reservar'}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {!lista.length && !error && <div className="empty"><Icon name={esPc ? 'cpu' : 'tv'} size={36} /><p>No hay {esPc ? 'PCs' : 'salas'} disponibles todavía.</p></div>}
      {elegido && <Reserva key={elegido._id} espacio={elegido} />}
    </>
  );
}

function Reserva({ espacio }) {
  const { user } = useAuth();
  const toast = useToast();
  const nav = useNavigate();
  const hoy = new Date().toLocaleDateString('sv-SE'); // fecha local AAAA-MM-DD
  const [fecha, setFecha] = useState(hoy);
  const [franjas, setFranjas] = useState([]);
  const [inicio, setInicio] = useState(null);
  const [horas, setHoras] = useState(1);

  const cargar = () =>
    apiGet(`/reservas/disponibilidad?espacio=${espacio._id}&fecha=${fecha}`)
      .then((r) => { setFranjas(r.franjas); setInicio(null); setHoras(1); })
      .catch((e) => toast(e.message, 'err'));
  useEffect(() => { cargar(); }, [fecha, espacio._id]);

  const libre = (h) => franjas.find((f) => f.hora === h)?.libre;
  let max = 0; // cuántas horas seguidas puedo coger desde la hora elegida (máximo 4)
  while (inicio !== null && max < 4 && libre(inicio + max)) max++;
  const h = Math.min(horas, max || 1);

  const reservar = async () => {
    if (!user) return nav('/login');
    try {
      await apiPost('/reservas', { espacio: espacio._id, fecha, horaInicio: inicio, horas: h });
      toast('¡Reserva confirmada! Puedes verla en Mi cuenta.');
      cargar();
    } catch (e) { toast(e.message, 'err'); }
  };

  return (
    <section className="card booking">
      <div className="booking-head">
        <span className="qi"><Icon name="calendar" /></span>
        <div><span className="tag">Nueva reserva</span><h2>{espacio.nombre}</h2></div>
      </div>
      <div className="booking-grid">
        <div>
          <label htmlFor="fecha">1 · Fecha</label>
          <input id="fecha" type="date" min={hoy} value={fecha} onChange={(e) => setFecha(e.target.value)} />
          <label>2 · Hora de inicio <small className="muted">(abrimos de 10:00 a 23:00)</small></label>
          <div className="slots">
            {franjas.map((f) => (
              <button key={f.hora} className={inicio === f.hora ? 'sel' : ''} disabled={!f.libre || (fecha === hoy && f.hora <= new Date().getHours())} onClick={() => setInicio(f.hora)}>
                {f.hora}:00
              </button>
            ))}
          </div>
          <p className="legend small muted"><i className="dot free" /> libre <i className="dot busy" /> ocupado</p>
        </div>
        <div className="summary">
          <label>3 · Duración</label>
          {inicio === null ? <p className="muted">Elige primero una hora de inicio.</p> : (
            <div className="slots">
              {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
                <button key={n} className={h === n ? 'sel' : ''} onClick={() => setHoras(n)}>{n} h</button>
              ))}
            </div>
          )}
          <dl>
            <dt>Fecha</dt><dd>{fecha.split('-').reverse().join('/')}</dd>
            <dt>Horario</dt><dd>{inicio === null ? '—' : `${inicio}:00 - ${inicio + h}:00`}</dd>
            <dt>Precio/hora</dt><dd>{espacio.precioHora.toFixed(2)} €</dd>
          </dl>
          <div className="cart-total"><span>Total</span><span className="price">{inicio === null ? '0.00' : (espacio.precioHora * h).toFixed(2)} €</span></div>
          <button className="btn full" disabled={inicio === null} onClick={reservar}>
            {user ? 'Confirmar reserva' : 'Inicia sesión para reservar'} <Icon name="arrow" size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
