import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/site/Breadcrumbs';
import { InquiryForm } from '@/components/site/InquiryForm';
import { MailIcon, PhoneIcon } from '@/components/site/Icons';
import { Photo } from '@/components/site/Photo';
import { RoomEntry } from '@/components/site/RoomEntry';
import { RoomSelectionProvider } from '@/components/site/RoomSelection';
import { SelectedRoomChip } from '@/components/site/SelectedRoomChip';
import { copy, getPageCopy, getRooms, getSettings } from '@/lib/api';

export const metadata: Metadata = { title: 'Rooms & Accommodation' };

export default async function RoomsPage({ searchParams }: { searchParams: { room?: string } }) {
  const [settings, pc, rooms] = await Promise.all([getSettings(), getPageCopy(), getRooms()]);
  const hero = copy(pc, 'rooms_hero');
  const inq = copy(pc, 'rooms_inquiry');
  const initialRoomId = searchParams.room && rooms.some((r) => String(r.id) === searchParams.room) ? searchParams.room : '';

  return (
    <RoomSelectionProvider initialRoomId={initialRoomId}>
      <main id="main">
        <section aria-labelledby="page-h" style={{ position: 'relative', minHeight: 'clamp(440px, 58vh, 620px)', display: 'flex', alignItems: 'flex-end', color: '#F8F6F0', overflow: 'hidden', background: '#292A27' }}>
          <Photo src={hero.imageUrl} alt="" label="Wide guest room" dark kenBurns priority style={{ position: 'absolute', inset: 0 }} />
          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(24,24,22,0.2), rgba(24,24,22,0.7))' }} />
          <div className="wrap" style={{ position: 'relative', paddingTop: 96, paddingBottom: 'clamp(48px, 7vw, 88px)' }}>
            <Breadcrumbs current="Rooms" />
            <h1 id="page-h" className="serif reveal" style={{ margin: '22px 0 0', fontSize: 'clamp(48px, 7vw, 104px)', lineHeight: 0.98, letterSpacing: '-0.02em' }}>{hero.title}</h1>
            <p className="reveal-2" style={{ maxWidth: 540, marginTop: 22, fontSize: 'clamp(16px, 1.3vw, 18px)', lineHeight: 1.7, color: '#EEE9DF' }}>{hero.body}</p>
          </div>
        </section>

        <section aria-label="Room categories" style={{ padding: 'clamp(80px, 10vw, 152px) 0 0' }}>
          {rooms.length > 0 ? (
            <div className="rows-stack">
              {rooms.map((r, i) => <RoomEntry key={r.id} room={r} index={i} />)}
            </div>
          ) : (
            <div className="wrap">
              <div className="empty-state">
                <p className="serif" style={{ fontSize: 34 }}>Room details are on their way</p>
                <p className="hint" style={{ marginTop: 10 }}>You can still send an inquiry below and the hotel will tell you what’s available.</p>
              </div>
            </div>
          )}
        </section>

        <section id="inquiry" aria-labelledby="inq-h" className="section" style={{ scrollMarginTop: 84 }}>
          <div className="wrap" style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(40px, 7vw, 112px)', alignItems: 'flex-start' }}>
            <div style={{ flex: '1 1 300px', maxWidth: 400 }}>
              <p className="eyebrow">{inq.eyebrow}</p>
              <h2 id="inq-h" className="h2">{inq.title}</h2>
              <p className="lead" style={{ marginTop: 22 }}>{inq.body}</p>
              <SelectedRoomChip rooms={rooms} />
              <div style={{ marginTop: 36, paddingTop: 28, borderTop: '1px solid #DCD7CD', display: 'flex', flexDirection: 'column', gap: 12, fontSize: 15 }}>
                {settings.phoneHref && <a href={settings.phoneHref} style={{ textDecoration: 'none', display: 'flex', gap: 12, alignItems: 'center', minHeight: 44, color: '#292A27' }}><span style={{ color: '#6E5A39' }}><PhoneIcon /></span>{settings.phone}</a>}
                {settings.emailHref && <a href={settings.emailHref} style={{ textDecoration: 'none', display: 'flex', gap: 12, alignItems: 'center', minHeight: 44, wordBreak: 'break-all', color: '#292A27' }}><span style={{ color: '#6E5A39', flex: 'none' }}><MailIcon /></span>{settings.email}</a>}
                <Link href="/contact" className="hint">More ways to reach us →</Link>
              </div>
            </div>
            <div style={{ flex: '999 1 560px', minWidth: 0, background: '#FFFFFF', border: '1px solid #DCD7CD', padding: 'clamp(24px, 4vw, 56px)' }}>
              <InquiryForm rooms={rooms} settings={settings} source="rooms" initialRoomId={initialRoomId} />
            </div>
          </div>
        </section>
      </main>
    </RoomSelectionProvider>
  );
}
