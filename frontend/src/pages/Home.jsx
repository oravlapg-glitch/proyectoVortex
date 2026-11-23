import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiGet } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { SECCIONES } from '../components/Layout';
import Icon from '../components/Icon';
import ProductCard from '../components/ProductCard';
import { TARIFAS, CARTA, MENU_ESPECIAL, RANKING, TORNEOS } from '../data/vortex';

export default function Home() {
  const { user } = useAuth();
  const [prods, setProds] = useState([]);
  const [salas, setSalas] = useState([]);
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    Promise.all([
      apiGet('/productos').then((r) => setProds(r.slice(0, 4))).catch(() => {}),
      apiGet('/espacios?tipo=sala&limit=10').then((r) => setSalas(r.datos)).catch(() => {}),
    ]).then(() => setCargado(true));
  }, []);

  const capacidades = salas.map((s) => s.capacidad);
  const rango = capacidades.length ? `${Math.min(...capacidades)} - ${Math.max(...capacidades)} personas` : '2 - 8 personas';

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-txt">
          <span className="tag">Tu club gamer</span>
          <h1>MÁS QUE UN LUGAR<br />ES UNA <span className="lime glow">EXPERIENCIA</span></h1>
          <p>Juega, compra, come, compite y comparte en un mismo sitio. <span className="violet-txt">Vortex Station</span>, tu punto de encuentro gamer.</p>
          <div className="row left">
            <Link className="btn" to="/salas">Reservar sala <Icon name="arrow" size={18} /></Link>
            <Link className="btn o" to="/tienda">Explorar tienda</Link>
          </div>
        </div>
        <div className="hero-logo" aria-hidden="true">
          <span className="ring" /><span className="ring r2" />
          <img src="/logo.png" alt="" />
        </div>
      </section>

      {/* ACCESOS RÁPIDOS */}
      <nav className="quick" aria-label="Accesos rápidos">
        {SECCIONES.slice(1).map((s) => (
          <Link key={s.to} to={s.to} className="quick-item">
            <span className="qi"><Icon name={s.icon} size={22} /></span>
            <span><b>{s.txt}</b><small>{s.sub}</small></span>
          </Link>
        ))}
      </nav>

      {!cargado ? null : !prods.length && !salas.length && (
        <p className="ok">Aún no hay datos en la base de datos. {user?.rol === 'ADMIN'
          ? <>Cárgalos en <Link to="/admin">Base de datos → Datos</Link>.</>
          : 'Entra como admin y carga los datos de ejemplo.'}</p>
      )}

      {/* TIENDA */}
      <section className="band">
        <div className="band-txt">
          <span className="tag">Tienda</span>
          <h2>EQUÍPATE PARA<br />EL SIGUIENTE NIVEL</h2>
          <p className="muted">Los mejores periféricos, accesorios y merch al mejor precio.</p>
          <Link className="btn" to="/tienda">Ver todos los productos <Icon name="arrow" size={18} /></Link>
        </div>
        <div className="cards4">
          {prods.map((p) => <ProductCard key={p._id} p={p} />)}
          {cargado && !prods.length && <p className="muted">Todavía no hay productos.</p>}
        </div>
      </section>

      {/* TARIFAS */}
      <section className="band">
        <div className="band-img img-pc" aria-hidden="true"><Icon name="gamepad" size={80} /></div>
        <div className="band-txt">
          <span className="tag">Tarifas gaming</span>
          <h2>ELIGE TU PLAN<br />Y JUEGA SIN LÍMITES</h2>
          <p className="muted">Horas, bonos y packs adaptados a ti. Juega solo, con amigos o en equipo.</p>
          <Link className="btn" to="/gaming">Ver tarifas <Icon name="arrow" size={18} /></Link>
        </div>
        <div className="plans">
          {TARIFAS.filter((t) => t.id !== '3h').map((t) => (
            <div key={t.id} className={'plan' + (t.top ? ' top' : '')}>
              {t.top && <span className="plan-badge"><Icon name="star" size={12} /> Más popular</span>}
              <span className="tag">{t.titulo}</span>
              <p className="plan-price">{t.precio.toFixed(2).replace('.', ',')} €</p>
              <p className={t.id === '1h' ? 'muted small' : 'lime small'}>{t.nota}</p>
              <ul>{t.items.map((i) => <li key={i}><Icon name="check" size={14} />{i}</li>)}</ul>
              <Link to="/gaming" className={'btn sm full ' + (t.top ? '' : 'v')}>Seleccionar</Link>
            </div>
          ))}
        </div>
      </section>

      {/* COMIDA */}
      <section className="band">
        <div className="band-txt">
          <span className="tag">Comida &amp; bebida</span>
          <h2>RECARGA ENERGÍA,<br />SIGUE JUGANDO</h2>
          <p className="muted">Burgers, snacks, bebidas y mucho más. Porque los grandes jugadores también comen.</p>
          <Link className="btn" to="/comida">Ver carta <Icon name="arrow" size={18} /></Link>
        </div>
        <div className="foods">
          {[CARTA.comida[0], CARTA.comida[3], CARTA.bebidas[2], CARTA.bebidas[5]].map((c) => (
            <div key={c.nombre} className="food">
              <span className="food-emoji">{c.emoji}</span>
              <b>{c.nombre}</b>
              <span className="price sm">{c.precio.toFixed(2)} €</span>
            </div>
          ))}
          <div className="food special">
            <span className="tag lime">{MENU_ESPECIAL.titulo}</span>
            <span className="food-emoji">🍔🥤</span>
            <b>{MENU_ESPECIAL.texto}</b>
            <span className="price">{MENU_ESPECIAL.precio.toFixed(2)} €</span>
          </div>
        </div>
      </section>

      {/* SALAS */}
      <section className="band">
        <div className="band-img img-sala" aria-hidden="true"><Icon name="tv" size={80} /></div>
        <div className="band-txt">
          <span className="tag">Salas privadas</span>
          <h2>TU EQUIPO, TU ESPACIO</h2>
          <p className="muted">Salas privadas para grupos, eventos y streaming. Conéctate, juega y disfruta en total privacidad.</p>
          <Link className="btn" to="/salas">Reservar sala <Icon name="arrow" size={18} /></Link>
        </div>
        <div className="feats">
          <div><Icon name="users" /><span>Múltiples tamaños<small>{rango}</small></span></div>
          <div><Icon name="cpu" /><span>Equipos de alto rendimiento<small>Consolas y PCs top</small></span></div>
          <div><Icon name="tv" /><span>Pantallas 4K<small>Sonido envolvente</small></span></div>
          <div><Icon name="clock" /><span>Tarifa por hora<small>o por paquete</small></span></div>
        </div>
      </section>

      {/* TORNEOS */}
      <section className="band">
        <div className="band-img img-torneo" aria-hidden="true"><Icon name="trophy" size={80} /></div>
        <div className="band-txt">
          <span className="tag">Torneos</span>
          <h2>COMPITE, DEMUESTRA,<br />GANA</h2>
          <p className="muted">Torneos semanales, ligas y eventos especiales. ¿Tienes lo que se necesita?</p>
          <Link className="btn" to="/torneos">Ver torneos <Icon name="arrow" size={18} /></Link>
        </div>
        <div className="board">
          <div className="board-head">
            <span><span className="tag">Torneo actual</span><b>{TORNEOS[0].juego}</b></span>
            <span className="pill live">En curso</span>
          </div>
          <ol>
            {RANKING.map((r, i) => (
              <li key={r.nick}><span className="pos">{i + 1}</span><span className="avatar sm">{r.nick[0]}</span>{r.nick}<b>{r.pts} pts</b></li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
