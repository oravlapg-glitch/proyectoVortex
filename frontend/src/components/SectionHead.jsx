// Cabecera de cada página: etiqueta pequeña + título grande + texto
export default function SectionHead({ tag, titulo, children }) {
  return (
    <header className="page-head">
      {tag && <span className="tag">{tag}</span>}
      <h1>{titulo}</h1>
      {children && <p className="lead">{children}</p>}
    </header>
  );
}
