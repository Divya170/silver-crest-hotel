'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface Ctx {
  roomId: string;
  setRoomId: (id: string) => void;
}

const RoomCtx = createContext<Ctx | null>(null);

/** Carries the room chosen on /rooms (or via ?room=<id>) into the inquiry form. */
export function RoomSelectionProvider({ initialRoomId = '', children }: { initialRoomId?: string; children: React.ReactNode }) {
  const [roomId, setRoomId] = useState(initialRoomId);
  useEffect(() => setRoomId(initialRoomId), [initialRoomId]);
  return <RoomCtx.Provider value={{ roomId, setRoomId }}>{children}</RoomCtx.Provider>;
}

export function useRoomSelection() {
  return useContext(RoomCtx);
}

export function RoomPickButton({ roomId, label = 'Inquire About This Room', className = 'btn', style }: { roomId: number; label?: string; className?: string; style?: React.CSSProperties }) {
  const ctx = useRoomSelection();
  const pick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!ctx) return;
      e.preventDefault();
      ctx.setRoomId(String(roomId));
      const target = document.getElementById('inquiry');
      const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      target?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      window.history.replaceState(null, '', `?room=${roomId}#inquiry`);
      setTimeout(() => document.getElementById('fld-checkIn')?.focus({ preventScroll: true }), reduced ? 0 : 500);
    },
    [ctx, roomId],
  );
  return (
    <a className={className} href={`/rooms?room=${roomId}#inquiry`} onClick={pick} style={style}>
      {label} <span className="arr" aria-hidden="true">→</span>
    </a>
  );
}
