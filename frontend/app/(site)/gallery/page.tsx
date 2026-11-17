import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/site/Breadcrumbs';
import { GalleryBrowser } from '@/components/site/GalleryBrowser';
import { copy, getGallery, getPageCopy } from '@/lib/api';

export const metadata: Metadata = { title: 'Gallery' };

export default async function GalleryPage({ searchParams }: { searchParams: { category?: string } }) {
  const [pc, gallery] = await Promise.all([getPageCopy(), getGallery()]);
  const hero = copy(pc, 'gallery_hero');
  const cta = copy(pc, 'gallery_cta');
  const placeholders = gallery.items.filter((g) => !g.imageUrl).length;
  const title = hero.title.replace(/Silver Crest$/, '');

  return (
    <main id="main">
      <section aria-labelledby="page-h" className="page-pad">
        <div className="wrap">
          <Breadcrumbs current="Gallery" light />
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 32, marginTop: 'clamp(32px, 4vw, 56px)' }}>
            <h1 id="page-h" className="serif reveal" style={{ margin: 0, fontSize: 'clamp(56px, 8.6vw, 132px)', lineHeight: 0.92, letterSpacing: '-0.025em' }}>
              {title}{/Silver Crest$/.test(hero.title) && <em style={{ fontStyle: 'italic', color: '#6E5A39' }}>Silver Crest</em>}
            </h1>
            <p className="lead reveal-2" style={{ maxWidth: 400 }}>{hero.body}</p>
          </div>
        </div>
      </section>

      <section aria-label="Photo gallery" style={{ paddingBottom: 'clamp(88px, 11vw, 160px)' }}>
        <div className="wrap">
          {placeholders > 0 && (
            <div className="todo" style={{ marginBottom: 28 }}>
              <span className="todo-tag">Client to supply</span>
              {placeholders} of {gallery.items.length} photos are still placeholders. Real hotel photographs replace them as they’re uploaded; a category with no real photos stays empty rather than using stock images.
            </div>
          )}
          <GalleryBrowser items={gallery.items} initialCategory={searchParams.category} />
        </div>
      </section>

      <section aria-labelledby="cta-h" style={{ borderTop: '1px solid #DCD7CD', padding: 'clamp(64px, 8vw, 104px) 0' }}>
        <div className="wrap" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 32 }}>
          <div><p className="eyebrow">{cta.eyebrow}</p><h2 id="cta-h" className="h2" style={{ fontSize: 'clamp(32px, 3.8vw, 52px)' }}>{cta.title}</h2></div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <Link className="btn" href="/contact#inquiry">Inquire About Reservations <span className="arr" aria-hidden="true">→</span></Link>
            <Link className="btn btn-ghost" href="/rooms">Explore Rooms</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
