/** Dashed "Client to supply" note from the comp. Rendered only while the admin leaves a note on the record. */
export function ClientNote({ note, tag = 'Client to supply', dark, style }: { note?: string | null; tag?: string; dark?: boolean; style?: React.CSSProperties }) {
  if (!note) return null;
  return (
    <div className={`todo ${dark ? 'todo-dark' : ''}`} style={style}>
      <span className="todo-tag">{tag}</span>
      {note}
    </div>
  );
}
