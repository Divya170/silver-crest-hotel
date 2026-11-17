import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/site/Breadcrumbs';
import { ClientNote } from '@/components/site/ClientNote';
import { AmenityIcon } from '@/components/site/Icons';
import { Photo } from '@/components/site/Photo';
import { copy, getAmenities, getPageCopy, getSettings } from '@/lib/api';

export const metadata: Metadata = { title: 'Amenities' };

const SUGGESTED_GROUPS = ['In your room · [to confirm]', 'Around the hotel · [to confirm]', 'Services · [to confirm]'];

export default async function AmenitiesPage() {
  const [settings, pc, amenities] = await Promise.all([getSettings(), getPageCopy(), getAmenities()]);
  const hero = copy(pc, 'amenities_hero');
  const groupsCopy = copy(pc, 'amenities_groups');
  const cta = copy(pc, 'amenities_cta');
  const none = amenities.total === 0;
  const featured = amenities.featured;
  const listGroups = none
    ? SUGGESTED_GROUPS.map((name) => ({ name, items: [null, null, null] as null[] }))
    : amenities.groups.map((g) => ({ name: g.name, items: g.items.filter((a) => a.id !== featured?.id) })).filter((g) => g.items.length);

  return (
    <main id="main">
      <section aria-labelledby="page-h" className="page-pad" style={{ paddingBottom: 'clamp(72px, 9vw, 128px)' }}>
        <div className="wrap">
          <Breadcrumbs current="Amenities" light />
          <div className="split" style={{ marginTop: 'clamp(32px, 4vw, 56px)', alignItems: 'flex-end' }}>
            <div>
              <p className="eyebrow reveal">{hero.eyebrow}</p>
              <h1 id="page-h" className="serif reveal-2" style={{ margin: '20px 0 0', fontSize: 'clamp(52px, 7.4vw, 112px)', lineHeight: 0.95, letterSpacing: '-0.02em' }}>{hero.title}</h1>
              <p className="lead reveal-3" style={{ marginTop: 28, maxWidth: 480 }}>{hero.body}</p>
            </div>
            <Photo src={hero.imageUrl} alt="" label="Atmospheric interior" kenBurns priority tone="#D3CDC1" style={{ aspectRatio: '4 / 3' }} />
          </div>
        </div>
      </section>

      {none && (
        <section aria-label="Confirmation status" style={{ paddingBottom: 'clamp(48px, 6vw, 80px)' }}>
          <div className="wrap">
            <ClientNote
              tag="Awaiting confirmation from the hotel"
              note="No facilities have been confirmed yet. Each slot below fills only with an amenity the hotel confirms, with its name, a short description and an icon or photo. Nothing is assumed: not Wi-Fi, parking, a pool, dining, a gym, room service, meeting rooms, laundry or accessibility features."
              style={{ padding: '22px 26px' }}
            />
          </div>
        </section>
      )}

      {(featured || none) && (
        <section aria-labelledby="feat-h" style={{ paddingBottom: 'clamp(88px, 11vw, 160px)' }}>
          <div className="wrap g-collapse" style={{ gridTemplateColumns: 'repeat(12, minmax(0, 1fr))', gap: 'clamp(24px, 3vw, 40px)', alignItems: 'stretch' }}>
            <Photo src={featured?.imageUrl} alt={featured?.imageAlt || featured?.name || ''} label="Featured amenity" zoom className="zoom-host" style={{ gridColumn: 'span 7', minHeight: 480 }} />
            <div style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <p className="eyebrow">Featured</p>
              <h2 id="feat-h" className="h2">{featured ? featured.name : '[Featured amenity]'}</h2>
              <p className="lead prose-copy" style={{ marginTop: 20 }}>
                {featured ? featured.description : 'A larger, photo-led presentation for the facility the hotel most wants guests to know about, once confirmed.'}
              </p>
            </div>
          </div>
        </section>
      )}

      {listGroups.length > 0 && (
        <section aria-labelledby="groups-h" style={{ background: '#EEE9DF', padding: 'clamp(88px, 10vw, 152px) 0' }}>
          <div className="wrap">
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, marginBottom: 'clamp(40px, 5vw, 72px)' }}>
              <h2 id="groups-h" className="h2" style={{ margin: 0, maxWidth: '12ch' }}>{groupsCopy.title}</h2>
              {groupsCopy.body && <p className="lead" style={{ maxWidth: 420 }}>{groupsCopy.body}</p>}
            </div>
            <div className="g-collapse" style={{ gridTemplateColumns: `repeat(${Math.min(3, listGroups.length)}, minmax(0, 1fr))`, gap: 'clamp(32px, 4vw, 56px)' }}>
              {listGroups.map((g) => (
                <div key={g.name}>
                  <h3 className="eyebrow" style={{ paddingBottom: 18, borderBottom: '1px solid #292A27', margin: 0 }}>{g.name}</h3>
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                    {g.items.map((a, i) => (
                      <li key={a?.id ?? i} style={{ display: 'flex', gap: 18, alignItems: 'center', padding: '20px 0', borderBottom: '1px solid #DCD7CD' }}>
                        <span aria-hidden="true" style={{ flex: 'none', width: 44, height: 44, border: a ? '1px solid #B39A70' : '1px dashed #9C8456', borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6E5A39' }}>
                          {a && <AmenityIcon name={a.icon} size={20} />}
                        </span>
                        <div>
                          <p className="serif" style={{ fontSize: 22, lineHeight: 1.15 }}>{a ? a.name : '[Amenity name]'}</p>
                          {(a?.description || !a) && <p className="hint" style={{ marginTop: 2 }}>{a ? a.description : 'Short description'}</p>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section aria-labelledby="cta-h" style={{ background: '#292A27', color: '#F8F6F0', padding: 'clamp(88px, 10vw, 144px) 0' }}>
        <div className="wrap split">
          <div>
            <p className="eyebrow" style={{ color: '#DCC9A3' }}>{cta.eyebrow}</p>
            <h2 id="cta-h" className="h2" style={{ color: '#F8F6F0' }}>{cta.title}</h2>
          </div>
          <div style={{ maxWidth: 460 }}>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: '#DCD7CD' }}>{cta.body}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 32 }}>
              <Link className="btn btn-light" href="/contact">Contact the Hotel <span className="arr" aria-hidden="true">→</span></Link>
              {settings.phoneHref && <a className="btn btn-outline-light" href={settings.phoneHref}>Call the Hotel</a>}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
