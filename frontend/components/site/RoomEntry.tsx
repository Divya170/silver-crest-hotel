import type { Room } from '@/lib/types';
import { ClientNote } from './ClientNote';
import { Photo } from './Photo';
import { RoomPickButton } from './RoomSelection';

function RoomDetails({ room, index }: { room: Room; index: number }) {
  const meta = [
    room.occupancyNote && { label: 'Occupancy', value: room.occupancyNote },
    room.sizeNote && { label: 'Size', value: room.sizeNote },
    room.rateNote && { label: 'Rates', value: room.rateNote },
  ].filter(Boolean) as { label: string; value: string }[];
  return (
    <>
      <p className="eyebrow">Room {String(index + 1).padStart(2, '0')}</p>
      <h2 id={`room-${room.id}`} className="h2">{room.name}</h2>
      {room.description && <p className="lead prose-copy" style={{ marginTop: 22 }}>{room.description}</p>}
      <ClientNote note={room.clientNote} style={{ marginTop: 24 }} />
      {meta.length > 0 && (
        <dl className="room-meta">
          {meta.map((m) => <div key={m.label}><dt className="sr">{m.label}</dt><dd style={{ margin: 0 }}><strong>{m.label}:</strong> {m.value}</dd></div>)}
        </dl>
      )}
      {(room.facilities.length > 0 || room.clientNote) && (
        <>
          <p className="eyebrow" style={{ color: '#55544F', marginTop: 32 }}>Confirmed facilities</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: '14px 0 0', display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {room.facilities.length > 0
              ? room.facilities.map((f) => <li key={f} className="facility">{f}</li>)
              : [0, 1, 2].map((k) => <li key={k} className="facility todo-pill">[Facility]</li>)}
          </ul>
        </>
      )}
    </>
  );
}

/** The comp's three alternating room layouts: split → split reversed (layered detail) → full-bleed feature, repeating. */
export function RoomEntry({ room, index }: { room: Room; index: number }) {
  const variant = index % 3;
  const alt = room.imageAlt || room.name;

  if (variant === 2) {
    return (
      <article aria-labelledby={`room-${room.id}`} style={{ position: 'relative', minHeight: 'clamp(560px, 62vw, 760px)', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
        <Photo src={room.imageUrl} alt={alt} label={`${room.name}, full-width feature`} tone="#CFC9BD" style={{ position: 'absolute', inset: 0 }} />
        <div className="wrap" style={{ position: 'relative', padding: '96px 0 clamp(24px, 5vw, 72px)' }}>
          <div style={{ background: '#F8F6F0', padding: 'clamp(28px, 4.5vw, 60px)', maxWidth: 600 }}>
            <RoomDetails room={room} index={index} />
            <RoomPickButton roomId={room.id} style={{ marginTop: 30 }} />
          </div>
        </div>
      </article>
    );
  }

  return (
    <div className="wrap">
      <article aria-labelledby={`room-${room.id}`} className={`split alt-row ${variant === 1 ? 'reverse' : ''}`}>
        {variant === 0 ? (
          <Photo src={room.imageUrl} alt={alt} label={room.name} zoom tone="#D3CDC1" className="zoom-host" style={{ aspectRatio: '5 / 4' }} />
        ) : (
          <div style={{ position: 'relative', paddingBottom: 64 }}>
            <Photo src={room.imageUrl} alt={alt} label={room.name} zoom className="zoom-host" style={{ aspectRatio: '4 / 3' }} />
            {!room.imageUrl && <Photo alt="" label="Detail" shortTag="Detail" tone="#E3DED4" style={{ position: 'absolute', left: -24, bottom: 0, width: '38%', aspectRatio: '1 / 1', border: '10px solid #F8F6F0' }} />}
          </div>
        )}
        <div style={{ maxWidth: 500 }}>
          <RoomDetails room={room} index={index} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 36 }}>
            <RoomPickButton roomId={room.id} />
          </div>
        </div>
      </article>
    </div>
  );
}
