import Link from 'next/link';
import { ClientNote } from '@/components/site/ClientNote';
import { HeroSlideshow } from '@/components/site/HeroSlideshow';
import { AmenityIcon } from '@/components/site/Icons';
import { MapPanel } from '@/components/site/MapPanel';
import { Photo } from '@/components/site/Photo';
import { copy, getAmenities, getContent, getGalleryHome, getPageCopy, getRooms, getSettings, getTestimonials } from '@/lib/api';

export default async function HomePage() {
  const [settings, pc, slides, rooms, amenities, themes, gallery, testimonials] = await Promise.all([
    getSettings(), getPageCopy(), getContent('hero_slide'), getRooms(), getAmenities(), getContent('why_theme'), getGalleryHome(), getTestimonials(),
  ]);
  const hero = copy(pc, 'home_hero');
  const welcome = copy(pc, 'home_welcome');
  const roomsCopy = copy(pc, 'home_rooms');
  const amen = copy(pc, 'home_amenities');
  const why = copy(pc, 'home_why');
  const exp = copy(pc, 'home_experience');
  const gal = copy(pc, 'home_gallery');
  const loc = copy(pc, 'home_location');
  const cta = copy(pc, 'home_cta');
  const [roomA, ...otherRooms] = rooms;
  const amenityRows = amenities.items.slice(0, 6);

  return (
    <main id="main">
      <HeroSlideshow slides={slides} autoplay={settings.heroAutoplay} intervalSeconds={settings.heroIntervalSeconds}>
        <div className="wrap" style={{ position: 'relative', paddingTop: 140, paddingBottom: 'clamp(64px, 9vw, 112px)' }}>
          {hero.eyebrow && <p className="eyebrow reveal" style={{ color: '#DCC9A3' }}>{hero.eyebrow}</p>}
          <h1 className="serif reveal-2" style={{ margin: '20px 0 0', fontSize: 'clamp(50px, 7.8vw, 120px)', lineHeight: 0.96, letterSpacing: '-0.02em', maxWidth: '10.5ch' }}>{hero.title}</h1>
          <p className="reveal-3" style={{ maxWidth: 520, fontSize: 'clamp(16px, 1.35vw, 19px)', lineHeight: 1.7, margin: '30px 0 40px', color: '#EEE9DF' }}>{hero.body}</p>
          <div className="reveal-3" style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
            <Link className="btn btn-light" href="/contact#inquiry">Inquire About Reservations <span className="arr" aria-hidden="true">→</span></Link>
            <Link className="btn btn-outline-light" href="/rooms">Explore Rooms</Link>
          </div>
        </div>
      </HeroSlideshow>

      <section aria-labelledby="welcome-h" className="section">
        <div className="wrap split">
          <div style={{ position: 'relative', paddingBottom: 72, paddingRight: 'clamp(0px, 6vw, 88px)' }}>
            <Photo src={welcome.imageUrl} alt={`${settings.hotelName} lobby`} label="Lobby or reception" style={{ aspectRatio: '4 / 5', width: '100%' }} />
            <Photo src={welcome.detailImageUrl} alt="" label="Room detail" shortTag={welcome.detailImageUrl ? '' : 'Room detail'} tone="#CFC9BD" style={{ position: 'absolute', right: 0, bottom: 0, width: '46%', aspectRatio: '1 / 1', border: '10px solid #F8F6F0' }} />
          </div>
          <div style={{ maxWidth: 520 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span aria-hidden="true" style={{ width: 48, height: 1, background: '#B39A70' }} />
              <p className="eyebrow">{welcome.eyebrow}</p>
            </div>
            <h2 id="welcome-h" className="h2">{welcome.title}</h2>
            <p className="lead prose-copy" style={{ marginTop: 28 }}>{welcome.body}</p>
            <ClientNote note={welcome.clientNote} style={{ marginTop: 28 }} />
            <Link className="link-arrow" href="/about" style={{ marginTop: 36 }}>About the hotel <span className="arr" aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="rooms-h" style={{ padding: '0 0 clamp(88px, 11vw, 168px)' }}>
        <div className="wrap">
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, marginBottom: 'clamp(40px, 5vw, 64px)' }}>
            <div style={{ maxWidth: 640 }}>
              <p className="eyebrow">{roomsCopy.eyebrow}</p>
              <h2 id="rooms-h" className="h2">{roomsCopy.title}</h2>
            </div>
            <Link className="link-arrow" href="/rooms">Explore Rooms <span className="arr" aria-hidden="true">→</span></Link>
          </div>
          {roomA ? (
            <div className="g-collapse" style={{ gridTemplateColumns: 'repeat(12, minmax(0, 1fr))', gap: 'clamp(20px, 2.5vw, 32px)' }}>
              <Link className="zoom-host" href={`/rooms?room=${roomA.id}#inquiry`} style={{ gridColumn: `span ${otherRooms.length ? 7 : 12}`, gridRow: 'span 2', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 22 }}>
                <Photo src={roomA.imageUrl} alt={roomA.imageAlt || roomA.name} label={roomA.name} zoom tone="#D3CDC1" style={{ flex: 1, minHeight: 420 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 20, alignItems: 'flex-end' }}>
                  <div>
                    <p className="serif" style={{ fontSize: 34, lineHeight: 1.1 }}>{roomA.name}</p>
                    <p className="hint" style={{ marginTop: 8 }}>{roomA.description ? roomA.description.slice(0, 140) + (roomA.description.length > 140 ? '…' : '') : 'Details to be confirmed by the hotel.'}</p>
                  </div>
                  <span className="eyebrow" style={{ whiteSpace: 'nowrap' }}>View &amp; inquire →</span>
                </div>
              </Link>
              {otherRooms.slice(0, 2).map((r, i) => (
                <Link key={r.id} className="zoom-host" href={`/rooms?room=${r.id}#inquiry`} style={{ gridColumn: 'span 5', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <Photo src={r.imageUrl} alt={r.imageAlt || r.name} label={r.name} shortTag={r.imageUrl ? undefined : r.name.replace(/[\[\]]/g, '')} zoom tone={i ? '#E3DED4' : undefined} style={{ aspectRatio: '16 / 10' }} />
                  <div>
                    <p className="serif" style={{ fontSize: 28, lineHeight: 1.1 }}>{r.name}</p>
                    <p className="hint" style={{ marginTop: 6 }}>{r.description ? r.description.slice(0, 100) + (r.description.length > 100 ? '…' : '') : 'Details to be confirmed by the hotel.'}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p className="serif" style={{ fontSize: 32 }}>Room details are on their way</p>
              <p className="hint" style={{ marginTop: 10 }}>Contact the hotel to ask about accommodation for your dates.</p>
              <Link className="btn" href="/contact#inquiry" style={{ marginTop: 24 }}>Inquire About Reservations</Link>
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="amen-h" style={{ background: '#EEE9DF', padding: 'clamp(88px, 10vw, 152px) 0' }}>
        <div className="wrap" style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(40px, 7vw, 112px)' }}>
          <div style={{ flex: '1 1 320px', maxWidth: 420 }}>
            <p className="eyebrow">{amen.eyebrow}</p>
            <h2 id="amen-h" className="h2">{amen.title}</h2>
            <p className="lead" style={{ marginTop: 24 }}>{amen.body}</p>
            <Link className="btn btn-ghost" href="/amenities" style={{ marginTop: 36 }}>Explore Amenities <span className="arr" aria-hidden="true">→</span></Link>
          </div>
          <div style={{ flex: '999 1 520px', minWidth: 0 }}>
            {amenityRows.length === 0 && (
              <ClientNote tag="Awaiting confirmation" note="No amenities have been confirmed yet. Only facilities the hotel confirms will appear in these rows. Nothing is assumed." style={{ marginBottom: 28 }} />
            )}
            <ul className="g-collapse" style={{ listStyle: 'none', margin: 0, padding: 0, gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', columnGap: 40 }}>
              {amenityRows.length > 0
                ? amenityRows.map((a) => (
                    <li key={a.id} style={{ display: 'flex', gap: 20, alignItems: 'flex-start', padding: '26px 0', borderTop: '1px solid #DCD7CD' }}>
                      <span aria-hidden="true" style={{ flex: 'none', width: 48, height: 48, border: '1px solid #B39A70', borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6E5A39' }}><AmenityIcon name={a.icon} /></span>
                      <div><p className="serif" style={{ fontSize: 24, lineHeight: 1.15 }}>{a.name}</p>{a.description && <p className="hint" style={{ marginTop: 6 }}>{a.description}</p>}</div>
                    </li>
                  ))
                : [1, 2, 3, 4, 5, 6].map((n) => (
                    <li key={n} style={{ display: 'flex', gap: 20, alignItems: 'flex-start', padding: '26px 0', borderTop: '1px solid #DCD7CD' }}>
                      <span aria-hidden="true" style={{ flex: 'none', width: 48, height: 48, border: '1px solid #B39A70', borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6E5A39', fontSize: 13, fontWeight: 600 }}>{String(n).padStart(2, '0')}</span>
                      <div><p className="serif" style={{ fontSize: 24, lineHeight: 1.15 }}>[Amenity name]</p><p className="hint" style={{ marginTop: 6 }}>Short description, with icon or photo, once confirmed.</p></div>
                    </li>
                  ))}
            </ul>
          </div>
        </div>
      </section>

      {themes.length > 0 && (
        <section aria-labelledby="why-h" className="section">
          <div className="wrap">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'clamp(48px, 6vw, 88px)' }}>
              <h2 id="why-h" className="serif" style={{ margin: 0, fontSize: 'clamp(44px, 6.4vw, 96px)', lineHeight: 0.98, letterSpacing: '-0.02em', maxWidth: '9ch' }}>
                {why.title.replace(/Silver Crest\?$/, '')}<em style={{ fontStyle: 'italic', color: '#6E5A39' }}>{/Silver Crest\?$/.test(why.title) ? 'Silver Crest?' : ''}</em>
              </h2>
              {why.body && <p className="lead" style={{ maxWidth: 400 }}>{why.body}</p>}
            </div>
            <ol className="g-collapse" style={{ listStyle: 'none', margin: 0, padding: 0, gridTemplateColumns: `repeat(${Math.min(4, themes.length)}, minmax(0, 1fr))`, gap: 'clamp(24px, 3vw, 40px)' }}>
              {themes.map((t, i) => (
                <li key={t.id} style={{ borderTop: '1px solid #292A27', paddingTop: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <span className="serif" aria-hidden="true" style={{ fontSize: 64, lineHeight: 1, color: '#B39A70' }}>{String(i + 1).padStart(2, '0')}</span>
                  <p className="serif" style={{ fontSize: 30, lineHeight: 1.1 }}>{t.title}</p>
                  {t.body && <p className="hint prose-copy" style={{ fontSize: 15 }}>{t.body}</p>}
                  <ClientNote tag="Client-approved copy" note={t.fields?.clientNote} style={{ fontSize: 13.5 }} />
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      <section aria-labelledby="exp-h" style={{ position: 'relative', minHeight: 'clamp(560px, 70vw, 820px)', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <Photo src={exp.imageUrl} alt="" label="Atmospheric interior, natural light" dark tone="#45443F" style={{ position: 'absolute', inset: 0 }} />
        <div className="wrap" style={{ position: 'relative', display: 'flex', justifyContent: 'flex-end', padding: '48px 0' }}>
          <div style={{ background: '#F8F6F0', padding: 'clamp(32px, 5vw, 72px)', maxWidth: 560, width: '100%' }}>
            <p className="eyebrow">{exp.eyebrow}</p>
            <h2 id="exp-h" className="h2">{exp.title}</h2>
            <p className="lead" style={{ marginTop: 24 }}>{exp.body}</p>
            {testimonials.enabled && testimonials.items[0] && (
              <figure style={{ margin: '32px 0 0', paddingTop: 28, borderTop: '1px solid #DCD7CD' }}>
                <p className="eyebrow" style={{ color: '#55544F' }}>Guest words</p>
                <blockquote className="serif" style={{ margin: '14px 0 0', fontSize: 26, lineHeight: 1.3, fontStyle: 'italic' }}>“{testimonials.items[0].quote}”</blockquote>
                <figcaption className="hint" style={{ marginTop: 10 }}>— {testimonials.items[0].guestName}{testimonials.items[0].context ? `, ${testimonials.items[0].context}` : ''}</figcaption>
              </figure>
            )}
          </div>
        </div>
      </section>

      <section aria-labelledby="gal-h" className="section">
        <div className="wrap">
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, marginBottom: 'clamp(40px, 5vw, 64px)' }}>
            <div><p className="eyebrow">{gal.eyebrow}</p><h2 id="gal-h" className="h2">{gal.title}</h2></div>
            <Link className="link-arrow" href="/gallery">Explore Gallery <span className="arr" aria-hidden="true">→</span></Link>
          </div>
          {gallery.length > 0 ? (
            <div className="home-gal">
              {gallery.map((g) => (
                <Link key={g.id} href={`/gallery?category=${encodeURIComponent(g.category)}`} className="zoom-host" aria-label={`Open gallery: ${g.title}`} style={{ position: 'relative', display: 'block', minHeight: 200 }}>
                  <Photo src={g.imageUrl} alt={g.alt || g.title} label={g.title} shortTag={g.imageUrl ? undefined : g.title} zoom tone={g.tone} style={{ position: 'absolute', inset: 0 }} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state"><p className="serif" style={{ fontSize: 30 }}>Photographs coming soon</p></div>
          )}
        </div>
      </section>

      <section aria-labelledby="loc-h" style={{ background: '#FFFFFF', borderTop: '1px solid #DCD7CD', borderBottom: '1px solid #DCD7CD' }}>
        <div className="split" style={{ gap: 0, alignItems: 'stretch' }}>
          <div style={{ padding: 'clamp(64px, 8vw, 128px) clamp(20px, 6vw, 96px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p className="eyebrow">{loc.eyebrow}</p>
            <h2 id="loc-h" className="h2">{loc.title}</h2>
            <address style={{ fontStyle: 'normal', marginTop: 28, fontSize: 18, lineHeight: 1.7 }}>{settings.addressLine1},<br />{settings.city}, {settings.region} {settings.postalCode},<br />{settings.country}</address>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 36 }}>
              <a className="btn" href={settings.mapsUrl}>Open in Google Maps <span className="arr" aria-hidden="true">→</span></a>
              <a className="btn btn-ghost" href={settings.directionsUrl}>Get Directions</a>
            </div>
            {settings.phoneHref && <p className="hint" style={{ marginTop: 22 }}>Questions about getting here? Call <a href={settings.phoneHref}>{settings.phone}</a>.</p>}
          </div>
          <MapPanel settings={settings} />
        </div>
      </section>

      <section aria-labelledby="cta-h" style={{ background: '#EEE9DF', padding: 'clamp(96px, 12vw, 176px) 0', textAlign: 'center' }}>
        <div className="wrap" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <svg width="56" height="30" viewBox="0 0 34 20" fill="none" aria-hidden="true"><path d="M1 18 L10 6 L15 12 L20 3 L33 18" stroke="#B39A70" strokeWidth="1.2" strokeLinejoin="round" /></svg>
          <h2 id="cta-h" className="serif" style={{ margin: '28px 0 0', fontSize: 'clamp(46px, 6.6vw, 96px)', lineHeight: 1, letterSpacing: '-0.02em' }}>{cta.title}</h2>
          <p className="lead" style={{ marginTop: 24, maxWidth: 520 }}>{cta.body}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center', marginTop: 40 }}>
            <Link className="btn" href="/contact#inquiry">Inquire About Reservations <span className="arr" aria-hidden="true">→</span></Link>
            {settings.phoneHref && <a className="btn btn-ghost" href={settings.phoneHref}>Call the Hotel</a>}
          </div>
        </div>
      </section>
    </main>
  );
}
