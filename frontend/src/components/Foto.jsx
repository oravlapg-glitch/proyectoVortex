import { useState } from 'react';
import Icon from './Icon';

// Convierte un nombre en nombre de archivo: "Sala Seúl" -> "sala-seul" (quita tildes, espacios y símbolos)
export const slug = (txt) =>
  txt.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// Muestra una imagen de /public/img. Si todavía no existe, deja el hueco con una cámara
// y el nombre del archivo que hay que poner (dentro de frontend/public/img/)
export default function Foto({ src, alt = '' }) {
  const [falla, setFalla] = useState(false);
  if (!src || falla) {
    return (
      <div className="foto-vacia" title={src ? 'Pon la foto en frontend/public' + src : 'Sin foto'}>
        <Icon name="camera" size={28} />
        {src?.startsWith('/img/') && <small>{src.replace('/img/', '')}</small>}
      </div>
    );
  }
  return <img src={src} alt={alt} onError={() => setFalla(true)} />;
}
