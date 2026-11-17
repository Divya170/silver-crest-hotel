import Link from 'next/link';
import type { SiteSettings } from '@/lib/types';

export function Footer({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear();
  return (
    <footer className="foot" style={{ background: '#292A27', color: '#DCD7CD', padding: 'clamp(64px,8vw,104px) 0 40px' }}>
      <div className="wrap">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 56, justifyContent: 'space-between', paddingBottom: 56, borderBottom: '1px solid rgba(220,215,205,0.18)' }}>
          <div style={{ flex: '1 1 320px', maxWidth: 440 }}>
            <p className="serif" style={{ fontSize: 40, lineHeight: 1, color: '#F8F6F0' }}>{settings.hotelName}</p>
            <p style={{ margin: '18px 0 30px', lineHeight: 1.7, fontSize: 15 }}>Accommodation and reservation inquiries in {settings.city}, California.</p>
            <Link className="btn btn-light" href="/contact#inquiry" style={{ color: '#292A27', textDecoration: 'none' }}>Inquire About Reservations <span className="arr" aria-hidden="true">→</span></Link>
          </div>
          <nav aria-label="Footer" style={{ flex: '0 1 180px' }}>
            <p className="eyebrow" style={{ color: '#B39A70', marginBottom: 20 }}>Explore</p>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/rooms">Rooms &amp; Accommodation</Link></li>
              <li><Link href="/amenities">Amenities</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/gallery">Gallery</Link></li>
              <li><Link href="/contact">Contact &amp; Reservations</Link></li>
            </ul>
          </nav>
          <div style={{ flex: '0 1 300px' }}>
            <p className="eyebrow" style={{ color: '#B39A70', marginBottom: 20 }}>Visit &amp; Contact</p>
            <address style={{ fontStyle: 'normal', lineHeight: 1.9, fontSize: 15 }}>
              <a href={settings.mapsUrl}>{settings.addressLine1}<br />{settings.city}, {settings.region} {settings.postalCode}, {settings.country}</a><br />
              {settings.phoneHref && <><a href={settings.phoneHref}>{settings.phone}</a><br /></>}
              {settings.emailHref && <a href={settings.emailHref} style={{ wordBreak: 'break-all' }}>{settings.email}</a>}
            </address>
            <a className="link-arrow" href={settings.directionsUrl} style={{ color: '#F8F6F0', marginTop: 22, textDecoration: 'none' }}>Get Directions <span className="arr" aria-hidden="true">→</span></a>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 16, paddingTop: 28, fontSize: 13, color: '#B5B0A5' }}>
          <p>© {year} {settings.hotelName}. All rights reserved.</p>
          <p>{settings.footerNote}</p>
        </div>
      </div>
    </footer>
  );
}

/** Mobile-only bottom bar so the reservation CTA and phone are always one tap away. */
export function StickyCta({ settings }: { settings: SiteSettings }) {
  return (
    <div className="sticky-cta" role="region" aria-label="Quick actions">
      <Link className="btn" href="/contact#inquiry">Inquire</Link>
      {settings.phoneHref && <a className="btn btn-ghost" href={settings.phoneHref}>Call</a>}
    </div>
  );
}
