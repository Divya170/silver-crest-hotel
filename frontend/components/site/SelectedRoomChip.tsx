'use client';

import type { Room } from '@/lib/types';
import { useRoomSelection } from './RoomSelection';

export function SelectedRoomChip({ rooms }: { rooms: Room[] }) {
  const sel = useRoomSelection();
  const room = rooms.find((r) => String(r.id) === sel?.roomId);
  if (!room || !sel) return null;
  return (
    <div style={{ marginTop: 28, padding: '18px 20px', background: '#EEE9DF', display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center' }} aria-live="polite">
      <div>
        <p className="eyebrow" style={{ color: '#55544F' }}>Inquiring about</p>
        <p className="serif" style={{ fontSize: 24, marginTop: 4 }}>{room.name}</p>
      </div>
      <button type="button" className="btn btn-ghost" onClick={() => { sel.setRoomId(''); document.getElementById('fld-roomId')?.focus(); }} style={{ minHeight: 44, padding: '0 16px' }}>Change</button>
    </div>
  );
}
