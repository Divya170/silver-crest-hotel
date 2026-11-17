import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/site/Breadcrumbs';
import { ClientNote } from '@/components/site/ClientNote';
import { Photo } from '@/components/site/Photo';
import { copy, getContent, getGallery, getPageCopy } from '@/lib/api';
import type { GalleryItem } from '@/lib/types';

export const metadata: Metadata = { title: 'About' };

const ROMAN = ['i.', 'ii.', 'iii.', 'iv.', 'v.', 'vi.', 'vii.', 'viii.'];

export default async function AboutPage() {
  const [pc, values, gallery] = await Promise.all([getPageCopy(), getContent('philosophy'), getGallery()]);
  const hero = copy(pc, 'about_hero');
  const intro = copy(pc, 'about_intro');
  const phil = copy(pc, 'about_philosophy');
  const prop = copy(pc, 'about_property');
  const cta = copy(pc, 'about_cta');

  // Property overview uses real gallery photos: one exterior, one common area, two rooms (placeholders until uploaded).
  const pickBy = (c: GalleryItem['category'], n: number) => gallery.items.filter((g) => g.category === c).slice(0, n);
  const [ext] = pickBy('Exterior', 1);
  const [common] = pickBy('Common Areas', 1);
  const roomsPics = pickBy('Rooms', 2);

  return (
    <main id="main">
      <section aria-labelledby="page-h" style={{ position: 'relative', minHeight: 'clamp(520px, 72vh, 760px)', display: 'flex', alignItems: 'center', color: '#F8F6F0', overflow: 'hidden', background: '#292A27' }}>
        <Photo src={hero.imageUrl} alt="" label="Hotel exterior" dark kenBurns priority tone="#403E38" style={{ position: 'absolute', inset: 0 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(24,24,22,0.72) 0%, rgba(24,24,22,0.25) 70%)' }} />
        <div className="wrap" style={{ position: 'relative', paddingTop: 72, paddingBottom: 72 }}>
          <Breadcrumbs current="About" />
          <h1 id="page-h" className="serif reveal" style={{ margin: '24px 0 0', fontSize: 'clamp(52px, 7.6vw, 116px)', lineHeight: 0.95, letterSpacing: '-0.02em', maxWidth: '9ch' }}>{hero.title}</h1>
          <p className="reveal-2" style={{ maxWidth: 500, marginTop: 28, fontSize: 'clamp(16px, 1.3vw, 18px)', lineHeight: 1.7, color: '#EEE9DF' }}>{hero.body}</p>
        </div>
      </section>

      <section aria-labelledby="intro-h" className="section">
        <div className="wrap g-collapse" style={{ gridTemplateColumns: 'repeat(12, minmax(0, 1fr))', gap: 'clamp(24px, 3vw, 48px)' }}>
          <div style={{ gridColumn: '1 / span 4' }}>
            <p className="eyebrow">{intro.eyebrow}</p>
            <p className="serif" aria-hidden="true" style={{ fontSize: 'clamp(120px, 14vw, 200px)', lineHeight: 0.8, color: '#DCD7CD', marginTop: 18 }}>SC</p>
          </div>
          <div style={{ gridColumn: '6 / span 7' }}>
            <h2 id="intro-h" className="serif" style={{ margin: 0, fontSize: 'clamp(32px, 3.6vw, 52px)', lineHeight: 1.15, fontWeight: 400 }}>{intro.title}</h2>
            {intro.body && <p className="lead prose-copy" style={{ marginTop: 28 }}>{intro.body}</p>}
            <ClientNote note={intro.clientNote} style={{ marginTop: 36 }} />
          </div>
        </div>
      </section>

      {values.length > 0 && (
        <section aria-labelledby="phil-h" style={{ background: '#EEE9DF', padding: 'clamp(88px, 11vw, 160px) 0' }}>
          <div className="wrap">
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, marginBottom: 'clamp(56px, 7vw, 96px)' }}>
              <div><p className="eyebrow">{phil.eyebrow}</p><h2 id="phil-h" className="h2">{phil.title}</h2></div>
              <ClientNote tag="Pending client approval" note={phil.clientNote} style={{ maxWidth: 400 }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {values.map((v, i) => (
                <div key={v.id} style={{ display: 'flex', flexWrap: 'wrap', gap: '16px 48px', alignItems: 'baseline', padding: 'clamp(28px, 3.5vw, 44px) 0', borderTop: '1px solid #C9C2B4' }}>
                  <span className="serif" aria-hidden="true" style={{ flex: '0 0 80px', fontSize: 22, color: '#6E5A39', fontStyle: 'italic' }}>{ROMAN[i] ?? `${i + 1}.`}</span>
                  <p className="serif" style={{ flex: '1 1 380px', fontSize: 'clamp(38px, 5vw, 72px)', lineHeight: 1, letterSpacing: '-0.015em' }}>{v.title}</p>
                  {v.body && <p className="hint" style={{ flex: '0 1 340px', fontSize: 15 }}>{v.body}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section aria-labelledby="prop-h" className="section">
        <div className="wrap">
          <div className="split" style={{ marginBottom: 'clamp(48px, 6vw, 80px)', alignItems: 'flex-end' }}>
            <div><p className="eyebrow">{prop.eyebrow}</p><h2 id="prop-h" className="h2">{prop.title}</h2>{prop.body && <p className="lead prose-copy" style={{ marginTop: 20 }}>{prop.body}</p>}</div>
            <ClientNote note={prop.clientNote} />
          </div>
          <div className="g-collapse" style={{ gridTemplateColumns: 'repeat(12, minmax(0, 1fr))', gap: 'clamp(12px, 1.6vw, 20px)' }}>
            <Photo src={ext?.imageUrl} alt={ext?.alt || 'Building exterior'} label="Building exterior" shortTag={ext?.imageUrl ? undefined : 'Building exterior'} style={{ gridColumn: 'span 5', aspectRatio: '4 / 5' }} />
            <div style={{ gridColumn: 'span 7', display: 'grid', gridTemplateRows: 'repeat(2, minmax(0, 1fr))', gap: 'clamp(12px, 1.6vw, 20px)' }}>
              <Photo src={common?.imageUrl} alt={common?.alt || 'Reception'} label="Reception or lobby" shortTag={common?.imageUrl ? undefined : 'Reception or lobby'} tone="#CFC9BD" style={{ minHeight: 240 }} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 'clamp(12px, 1.6vw, 20px)' }}>
                <Photo src={roomsPics[0]?.imageUrl} alt={roomsPics[0]?.alt || 'Guest room'} label="Guest room" shortTag={roomsPics[0]?.imageUrl ? undefined : 'Guest room'} tone="#E3DED4" style={{ minHeight: 240 }} />
                <Photo src={roomsPics[1]?.imageUrl} alt={roomsPics[1]?.alt || 'Room detail'} label="Architectural detail" shortTag={roomsPics[1]?.imageUrl ? undefined : 'Room detail'} style={{ minHeight: 240 }} />
              </div>
            </div>
          </div>
          <Link className="link-arrow" href="/gallery" style={{ marginTop: 36 }}>See the full gallery <span className="arr" aria-hidden="true">→</span></Link>
        </div>
      </section>

      <section aria-labelledby="cta-h" style={{ background: '#292A27', color: '#F8F6F0', padding: 'clamp(96px, 12vw, 168px) 0', textAlign: 'center' }}>
        <div className="wrap" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 id="cta-h" className="serif" style={{ margin: 0, fontSize: 'clamp(44px, 6.4vw, 92px)', lineHeight: 1, letterSpacing: '-0.02em', maxWidth: '14ch' }}>{cta.title}</h2>
          <p style={{ marginTop: 24, maxWidth: 480, fontSize: 17, lineHeight: 1.7, color: '#DCD7CD' }}>{cta.body}</p>
          <Link className="btn btn-light" href="/contact#inquiry" style={{ marginTop: 40 }}>Inquire About Your Stay <span className="arr" aria-hidden="true">→</span></Link>
        </div>
      </section>
    </main>
  );
}
