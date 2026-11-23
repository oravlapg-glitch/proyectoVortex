import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiGet } from '../api/api';

export default function Home() {
  const [pcs, setPcs] = useState([]);
  const [prods, setProds] = useState([]);

  useEffect(() => {
    apiGet('/espacios?limit=4').then((r) => setPcs(r.datos)).catch(() => {});
    apiGet('/productos').then((r) => setProds(r.slice(0, 4))).catch(() => {});
  }, []);

  return (
    <>
      <section className="hero">
        <div>
          <span className="tag">Tu club gamer</span>
          <h1>MÁS QUE UN LUGAR, ES UNA <b>EXPERIENCIA</b></h1>
          <p>Juega, compra y comparte en un mismo sitio. Vortex Station, tu punto de encuentro gamer.</p>
          <div className="row left">
            <Link className="btn" to="/gaming">Reservar PC →</Link>
            <Link className="btn o" to="/tienda">Explorar tienda</Link>
          </div>
        </div>
        <img src="/logo.png" alt="Logo Vortex Station" />
      </section>

      <h2>Tarifas <span className="lime">Gaming</span></h2>
      <div className="grid">
        {pcs.map((e) => (
          <Link to={e.tipo === 'pc' ? '/gaming' : '/salas'} className="card" key={e._id}>
            <span className="tag">{e.tipo}</span>
            <h3>{e.nombre}</h3>
            <p className="price">{e.precioHora.toFixed(2)} €/h</p>
          </Link>
        ))}
      </div>

      <h2>Equípate para el <span className="cyan">siguiente nivel</span></h2>
      <div className="grid">
        {prods.map((p) => (
          <Link to="/tienda" className="card" key={p._id}>
            <span className="tag">{p.categoria}</span>
            <h3>{p.nombre}</h3>
            <p className="price">{p.precio.toFixed(2)} €</p>
          </Link>
        ))}
      </div>
      {!pcs.length && !prods.length && <p className="ok">Aún no hay datos: entra como admin y carga los datos de ejemplo en Admin → Datos de ejemplo.</p>}
    </>
  );
}
