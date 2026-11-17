'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { ErrorPanel } from '@/components/admin/ui';
import { adminFetch } from '@/lib/admin-api';
import type { Inquiry } from '@/lib/types';
import { formatDate } from '@/lib/validation';

interface Stats { new: number; responded: number; archived: number; total: number; upcoming: number }
interface Checklist { roomsNeedingContent: number; rooms: number; galleryPlaceholders: number; gallery: number; amenities: number; contentNotes: number }

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<Inquiry[] | null>(null);
  const [check, setCheck] = useState<Checklist | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      const [s, r, rooms, gallery, amenities, content] = await Promise.all([
        adminFetch<Stats>('/admin/inquiries/stats'),
        adminFetch<{ items: Inquiry[] }>('/admin/inquiries?status=new&pageSize=5'),
        adminFetch<{ clientNote: string | null }[]>('/admin/rooms'),
        adminFetch<{ imageUrl: string | null }[]>('/admin/gallery'),
        adminFetch<unknown[]>('/admin/amenities'),
        adminFetch<{ fields: Record<string, string | null> }[]>('/admin/content'),
      ]);
      setStats(s);
      setRecent(r.items);
      setCheck({
        rooms: rooms.length, roomsNeedingContent: rooms.filter((x) => x.clientNote).length,
        gallery: gallery.length, galleryPlaceholders: gallery.filter((g) => !g.imageUrl).length,
        amenities: amenities.length, contentNotes: content.filter((c) => c.fields?.clientNote).length,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load the dashboard.');
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <>
      <div className="adm-head"><div><h1 className="adm-h1">Dashboard</h1><p className="adm-sub">Reservation inquiries and what still needs real content before launch.</p></div></div>
      {error && <ErrorPanel message={error} onRetry={load} />}
      <div className="adm-grid" style={{ marginBottom: 28 }}>
        {[
          ['New inquiries', stats?.new], ['Upcoming stays (not archived)', stats?.upcoming], ['Responded', stats?.responded], ['All inquiries', stats?.total],
        ].map(([label, v]) => (
          <div key={label as string} className="adm-card adm-stat"><p>{label}</p><p>{v ?? '–'}</p></div>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'flex-start' }}>
        <section className="adm-card" style={{ flex: '2 1 420px' }} aria-labelledby="recent-h">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 id="recent-h" className="serif" style={{ margin: 0, fontSize: 26, fontWeight: 500 }}>New inquiries</h2>
            <Link href="/admin/inquiries" className="adm-btn ghost sm">View all</Link>
          </div>
          {recent === null ? <div className="skel" style={{ height: 120 }} /> : recent.length === 0 ? (
            <p className="hint">No new inquiries. You’re all caught up.</p>
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {recent.map((i) => (
                <li key={i.id} style={{ padding: '12px 0', borderTop: '1px solid #EEE9DF' }}>
                  <Link href={`/admin/inquiries?open=${i.id}`} style={{ textDecoration: 'none', display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                    <span><strong>{i.name}</strong> <span className="hint">· {i.reference}</span></span>
                    <span className="hint">{formatDate(i.checkIn)} → {formatDate(i.checkOut)} · {i.guests} guest{i.guests === 1 ? '' : 's'}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="adm-card" style={{ flex: '1 1 300px' }} aria-labelledby="launch-h">
          <h2 id="launch-h" className="serif" style={{ margin: '0 0 12px', fontSize: 26, fontWeight: 500 }}>Content checklist</h2>
          {!check ? <div className="skel" style={{ height: 120 }} /> : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
              <li><Link href="/admin/rooms">{check.roomsNeedingContent ? `${check.roomsNeedingContent} of ${check.rooms} rooms still need real details` : `All ${check.rooms} rooms have content ✓`}</Link></li>
              <li><Link href="/admin/gallery">{check.galleryPlaceholders ? `${check.galleryPlaceholders} of ${check.gallery} gallery photos are placeholders` : 'All gallery items have photos ✓'}</Link></li>
              <li><Link href="/admin/amenities">{check.amenities ? `${check.amenities} amenities confirmed` : 'No amenities confirmed yet'}</Link></li>
              <li><Link href="/admin/content">{check.contentNotes ? `${check.contentNotes} content blocks show “Client to supply” notes` : 'No placeholder notes left ✓'}</Link></li>
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
