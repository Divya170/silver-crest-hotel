import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/site/Breadcrumbs';
import { InquiryForm } from '@/components/site/InquiryForm';
import { MapPanel } from '@/components/site/MapPanel';
import { copy, getPageCopy, getRooms, getSettings } from '@/lib/api';

export const metadata: Metadata = { title: 'Contact & Reservations' };

export default async function ContactPage({ searchParams }: { searchParams: { room?: string } }) {
  const [settings, pc, rooms] = await Promise.all([getSettings(), getPageCopy(), getRooms()]);
  const hero = copy(pc, 'contact_hero');
  const inq = copy(pc, 'contact_inquiry');
  const map = copy(pc, 'contact_map');
  const fin = copy(pc, 'contact_final');

  return (
    <main id="main">
      <section aria-labelledby="page-h" style={{ background: '#292A27', color: '#F8F6F0', padding: 'clamp(48px, 6vw, 80px) 0 clamp(72px, 9vw, 120px)' }}>
        <div className="wrap">
          <Breadcrumbs current="Contact & Reservations" />
          <div className="split" style={{ marginTop: 'clamp(32px, 4vw, 56px)', alignItems: 'flex-end' }}>
            <h1 id="page-h" className="serif reveal" style={{ margin: 0, fontSize: 'clamp(56px, 8.4vw, 128px)', lineHeight: 0.92, letterSpacing: '-0.025em' }}>{hero.title}</h1>
            <p className="reveal-2" style={{ maxWidth: 440, fontSize: 'clamp(16px, 1.3vw, 18px)', lineHeight: 1.7, color: '#DCD7CD' }}>{hero.body}</p>
          </div>
        </div>
      </section>

      <section aria-label="Contact information" style={{ background: '#292A27', color: '#F8F6F0', paddingBottom: 'clamp(56px, 7vw, 96px)' }}>
        <div className="wrap">
          <ul className="contact-cols">
            <li>
              <p className="eyebrow" style={{ color: '#DCC9A3' }}>Call</p>
              {settings.phoneHref ? (
                <a href={settings.phoneHref} className="serif" style={{ display: 'inline-block', marginTop: 14, fontSize: 'clamp(28px, 2.6vw, 36px)', color: '#F8F6F0', textDecoration: 'none', minHeight: 44 }}>{settings.phone}</a>
              ) : <p style={{ marginTop: 14, color: '#B5B0A5' }}>Phone number coming soon.</p>}
              <p style={{ marginTop: 8, fontSize: 14, color: '#B5B0A5' }}>Tap to call the hotel directly.</p>
            </li>
            <li>
              <p className="eyebrow" style={{ color: '#DCC9A3' }}>Email</p>
              {settings.emailHref ? (
                <a href={settings.emailHref} className="serif" style={{ display: 'inline-block', marginTop: 14, fontSize: 'clamp(24px, 2.2vw, 32px)', color: '#F8F6F0', textDecoration: 'none', wordBreak: 'break-all', minHeight: 44 }}>{settings.email}</a>
              ) : <p style={{ marginTop: 14, color: '#B5B0A5' }}>Email address coming soon.</p>}
              <p style={{ marginTop: 8, fontSize: 14, color: '#B5B0A5' }}>For questions and inquiries.</p>
            </li>
            <li>
              <p className="eyebrow" style={{ color: '#DCC9A3' }}>Visit</p>
              <a href={settings.mapsUrl} className="serif" style={{ display: 'inline-block', marginTop: 14, fontSize: 'clamp(24px, 2.2vw, 32px)', lineHeight: 1.2, color: '#F8F6F0', textDecoration: 'none' }}>
                {settings.addressLine1},<br />{settings.city}, {settings.region} {settings.postalCode}, {settings.country}
              </a>
              <p style={{ marginTop: 8, fontSize: 14, color: '#B5B0A5' }}>Opens in Google Maps.</p>
            </li>
          </ul>
        </div>
      </section>

      <section id="inquiry" aria-labelledby="inq-h" className="section" style={{ scrollMarginTop: 84 }}>
        <div className="wrap" style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(40px, 7vw, 112px)', alignItems: 'flex-start' }}>
          <div style={{ flex: '1 1 300px', maxWidth: 400 }}>
            <p className="eyebrow">{inq.eyebrow}</p>
            <h2 id="inq-h" className="h2">{inq.title}</h2>
            <p className="lead" style={{ marginTop: 22 }}>{inq.body}</p>
            <ol style={{ listStyle: 'none', margin: '40px 0 0', padding: 0, display: 'flex', flexDirection: 'column' }}>
              {['You send an inquiry with your dates.', 'The hotel reviews it and gets back to you.', 'Your reservation is confirmed only when the hotel confirms it with you.'].map((t, i, arr) => (
                <li key={t} style={{ display: 'flex', gap: 18, padding: '18px 0', borderTop: '1px solid #DCD7CD', borderBottom: i === arr.length - 1 ? '1px solid #DCD7CD' : undefined }}>
                  <span className="serif" style={{ fontSize: 22, color: '#6E5A39', fontStyle: 'italic' }}>{['i.', 'ii.', 'iii.'][i]}</span>
                  <span style={{ fontSize: 15, lineHeight: 1.6 }}>{t}</span>
                </li>
              ))}
            </ol>
          </div>
          <div style={{ flex: '999 1 560px', minWidth: 0, background: '#FFFFFF', border: '1px solid #DCD7CD', padding: 'clamp(24px, 4vw, 56px)' }}>
            <InquiryForm rooms={rooms} settings={settings} source="contact" initialRoomId={searchParams.room} />
          </div>
        </div>
      </section>

      <section aria-labelledby="map-h" style={{ background: '#FFFFFF', borderTop: '1px solid #DCD7CD', borderBottom: '1px solid #DCD7CD' }}>
        <div className="split alt-row reverse" style={{ gap: 0, alignItems: 'stretch' }}>
          <div style={{ padding: 'clamp(56px, 7vw, 112px) clamp(20px, 6vw, 96px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p className="eyebrow">{map.eyebrow}</p>
            <h2 id="map-h" className="h2">{map.title}</h2>
            <address style={{ fontStyle: 'normal', marginTop: 24, fontSize: 18, lineHeight: 1.7 }}>{settings.addressLine1},<br />{settings.city}, {settings.region} {settings.postalCode},<br />{settings.country}</address>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 32 }}>
              <a className="btn" href={settings.directionsUrl}>Get Directions <span className="arr" aria-hidden="true">→</span></a>
              <a className="btn btn-ghost" href={settings.mapsUrl}>Open in Google Maps</a>
            </div>
          </div>
          <MapPanel settings={settings} minHeight={480} />
        </div>
      </section>

      <section aria-labelledby="final-h" style={{ background: '#EEE9DF', padding: 'clamp(80px, 10vw, 136px) 0', textAlign: 'center' }}>
        <div className="wrap" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 id="final-h" className="serif" style={{ margin: 0, fontSize: 'clamp(40px, 5.6vw, 80px)', lineHeight: 1.02, letterSpacing: '-0.02em', maxWidth: '16ch' }}>{fin.title}</h2>
          <p className="lead" style={{ marginTop: 20, maxWidth: 480 }}>{fin.body}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginTop: 36 }}>
            {settings.phoneHref && <a className="btn" href={settings.phoneHref}>Call the Hotel <span className="arr" aria-hidden="true">→</span></a>}
            {settings.emailHref && <a className="btn btn-ghost" href={settings.emailHref}>Email the Hotel</a>}
          </div>
        </div>
      </section>
    </main>
  );
}
