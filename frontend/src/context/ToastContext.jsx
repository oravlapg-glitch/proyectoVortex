import { createContext, useContext, useState } from 'react';
import Icon from '../components/Icon';

const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);

// Avisos flotantes abajo a la derecha: toast('Añadido', 'ok') o toast('Algo falló', 'err')
export function ToastProvider({ children }) {
  const [lista, setLista] = useState([]);

  const quitar = (id) => setLista((l) => l.filter((t) => t.id !== id));
  const toast = (texto, tipo = 'ok') => {
    const id = Date.now() + Math.random();
    setLista((l) => [...l, { id, texto, tipo }]);
    setTimeout(() => quitar(id), 3500);
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {lista.map((t) => (
          <div key={t.id} className={'toast ' + t.tipo}>
            <span className="toast-ic"><Icon name={t.tipo === 'err' ? 'alert' : 'check'} size={18} /></span>
            <div>
              <b>{t.tipo === 'err' ? 'Error' : 'Hecho'}</b>
              <p>{t.texto}</p>
            </div>
            <button aria-label="Cerrar aviso" onClick={() => quitar(t.id)}><Icon name="x" size={16} /></button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
