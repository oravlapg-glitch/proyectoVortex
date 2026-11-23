import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiGet } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { SECCIONES } from '../components/Layout';
import Icon from '../components/Icon';
import Foto from '../components/Foto';
import ProductCard from '../components/ProductCard';
import { FoodCard } from './Comida';
import { PlanCard } from './Gaming';
import { Ranking } from './Torneos';
import { TIENDA_CATS } from '../data/vortex';

export default function Home() {
  const { user } = useAuth();
  const [prods, setProds] = useState([]);
  const [salas, setSalas] = useState([]);
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    Promise.all([
      apiGet('/productos').then(setProds).catch(() => {}),
      apiGet('/espacios?tipo=sala&limit=10').then((r) => setSalas(r.datos)).catch(() => {}),
    ]).then(() => setCargado(true));
  }, []);

  // Un solo GET de productos y aquí los separo por categoría
  const tienda = prods.filter((p) => TIENDA_CATS.includes(p.categoria)).slice(0, 4);
  const bonos = prods.filter((p) => p.categoria === 'bonos' && p.nombre.startsWith('Bono'));
  const comida = [
    ...prods.filter((p) => p.nombre === 'Menú especial Gamers'),
    ...prods.filter((p) => p.categoria === 'comida' && p.nombre !== 'Menú especial Gamers').slice(0, 2),
    ...prods.filter((p) => p.categoria === 'bebida').slice(2, 3),
  ];

  const capacidades = salas.map((s) => s.capacidad);
  const rango = capacidades.length ? `${Math.min(...capacidades)} - ${Math.max(...capacidades)} personas` : '2 - 8 personas';

  return (
    <>
      {/* PORTADA */}
      <section className="hero">
        <div className="hero-txt">
          <span className="tag lime">Tu club gamer</span>
          <h1>MÁS QUE UN LUGAR<br />ES UNA <span className="lime">EXPERIENCIA</span></h1>
          <p>Juega, compra, come, compite y comparte en un mismo sitio. <span className="cyan">Vortex Station</span>, tu punto de encuentro gamer.</p>
          <div className="row left">
            <Link className="btn" to="/salas">Reservar sala <Icon name="arrow" size={18} /></Link>
            <Link className="btn o" to="/tienda">Explorar tienda</Link>
          </div>
        </div>
        <div className="hero-img">
          <Foto src="/img/hero.jpg" alt="Zona gaming de Vortex Station" />
        </div>
      </section>

      {/* ACCESOS RÁPIDOS */}
      <nav className="quick" aria-label="Accesos rápidos">
        {SECCIONES.slice(1).map((s) => (
          <Link key={s.to} to={s.to} className={'quick-item ac-' + s.color}>
            <span className="qi"><Icon name={s.icon} size={22} /></span>
            <span><b>{s.txt}</b><small>{s.sub}</small></span>
          </Link>
        ))}
      </nav>

      {cargado && !prods.length && !salas.length && (
        <p className="ok">Aún no hay datos en la base de datos. {user?.rol === 'ADMIN'
          ? <>Cárgalos en <Link to="/admin">Base de datos → Datos</Link>.</>
          : 'Entra como admin y carga los datos de ejemplo.'}</p>
      )}

      {/* TIENDA */}
      <section className="band ac-violet">
        <div className="band-txt">
          <span className="tag">Tienda</span>
          <h2>EQUÍPATE PARA<br />EL <span className="violet-txt">SIGUIENTE NIVEL</span></h2>
          <p className="muted">Los mejores periféricos, accesorios y merch al mejor precio.</p>
          <Link className="btn v" to="/tienda">Ver todos los productos <Icon name="arrow" size={18} /></Link>
        </div>
        <div className="cards4">
          {tienda.map((p) => <ProductCard key={p._id} p={p} />)}
          {cargado && !tienda.length && <p className="muted">Todavía no hay productos.</p>}
        </div>
      </section>

      {/* TARIFAS */}
      <section className="band ac-lime">
        <div className="band-img"><Foto src="/img/gaming.jpg" alt="" /></div>
        <div className="band-txt">
          <span className="tag">Tarifas gaming</span>
          <h2>ELIGE TU PLAN<br />Y <span className="lime">JUEGA SIN LÍMITES</span></h2>
          <p className="muted">Horas, bonos y packs adaptados a ti. Compra tu bono aquí y actívalo en recepción.</p>
          <Link className="btn" to="/gaming">Ver tarifas y PCs <Icon name="arrow" size={18} /></Link>
        </div>
        <div className="plans">
          {bonos.map((p) => <PlanCard key={p._id} p={p} />)}
        </div>
      </section>

      {/* COMIDA */}
      <section className="band ac-cyan">
        <div className="band-txt">
          <span className="tag">Comida &amp; bebida</span>
          <h2>RECARGA ENERGÍA,<br /><span className="cyan">SIGUE JUGANDO</span></h2>
          <p className="muted">Burgers, snacks, bebidas y mucho más. Pídelo y te lo llevamos a tu puesto.</p>
          <Link className="btn" to="/comida">Ver carta completa <Icon name="arrow" size={18} /></Link>
        </div>
        <div className="foods">
          {comida.map((p) => <FoodCard key={p._id} p={p} sinDesc />)}
        </div>
      </section>

      {/* SALAS */}
      <section className="band ac-violet">
        <div className="band-img"><Foto src="/img/salas.jpg" alt="" /></div>
        <div className="band-txt">
          <span className="tag">Salas privadas</span>
          <h2>TU EQUIPO, <span className="violet-txt">TU ESPACIO</span></h2>
          <p className="muted">Salas privadas para grupos, eventos y streaming. Conéctate, juega y disfruta en total privacidad.</p>
          <Link className="btn v" to="/salas">Reservar sala <Icon name="arrow" size={18} /></Link>
        </div>
        <div className="feats">
          <div className="ac-violet"><span className="qi"><Icon name="users" /></span><span>Múltiples tamaños<small>{rango}</small></span></div>
          <div className="ac-lime"><span className="qi"><Icon name="cpu" /></span><span>Equipos de alto rendimiento<small>Consolas y PCs top</small></span></div>
          <div className="ac-cyan"><span className="qi"><Icon name="tv" /></span><span>Pantallas 4K<small>Sonido envolvente</small></span></div>
          <div className="ac-violet"><span className="qi"><Icon name="clock" /></span><span>Tarifa por hora<small>Hasta 4 horas seguidas</small></span></div>
        </div>
      </section>

      {/* TORNEOS */}
      <section className="band ac-lime">
        <div className="band-img"><Foto src="/img/torneos.jpg" alt="" /></div>
        <div className="band-txt">
          <span className="tag">Torneos</span>
          <h2>COMPITE, DEMUESTRA,<br /><span className="lime">GANA</span></h2>
          <p className="muted">Torneos semanales, ligas y eventos especiales. Inscríbete desde la web.</p>
          <Link className="btn" to="/torneos">Ver torneos e inscribirme <Icon name="arrow" size={18} /></Link>
        </div>
        <Ranking />
      </section>
    </>
  );
}
