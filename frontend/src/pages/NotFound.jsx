import { Link } from 'react-router-dom';
import Icon from '../components/Icon';

export default function NotFound() {
  return (
    <section className="notfound">
      <p className="big404">404</p>
      <h1>GAME <span className="red">OVER</span></h1>
      <p className="muted">Esta página no existe o se ha desconectado del servidor.</p>
      <Link to="/" className="btn">Volver al inicio <Icon name="arrow" size={18} /></Link>
    </section>
  );
}
