'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { SiteSettings } from '@/lib/types';
import { CloseIcon, CrestMark, MenuIcon, PhoneIcon } from './Icons';

export const NAV = [
  { href: '/', label: 'Home' },
  { href: '/rooms', label: 'Rooms' },
  { href: '/amenities', label: 'Amenities' },
  { href: '/about', label: 'About' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
];

export function Header({ settings }: { settings: SiteSettings }) {
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenu(false), [pathname]);

  useEffect(() => {
    if (!menu) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      toggleRef.current?.focus();
    };
  }, [menu]);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));
  const [first, ...rest] = settings.hotelName.split(' ');
  const wordmark = rest.length > 1 ? `${first} ${rest.slice(0, -1).join(' ')}` : first;

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header
        style={{
          position: 'sticky', top: 0, zIndex: 40, background: 'rgba(248,246,240,0.97)',
          borderBottom: `1px solid ${scrolled ? '#DCD7CD' : 'rgba(220,215,205,0)'}`,
          boxShadow: scrolled ? '0 8px 28px rgba(41,42,39,0.06)' : 'none', transition: 'border-color .3s, box-shadow .3s',
        }}
      >
        <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, height: 84 }}>
          <Link href="/" aria-label={`${settings.hotelName}, home`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 14, color: '#292A27' }}>
            <CrestMark />
            <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <span className="serif" style={{ fontSize: 27, letterSpacing: '0.01em' }}>{wordmark}</span>
              <span style={{ fontSize: 9.5, letterSpacing: '0.44em', textTransform: 'uppercase', color: '#55544F', marginTop: 6 }}>{settings.tagline}</span>
            </span>
          </Link>
          <nav aria-label="Primary" className="nav-links">
            {NAV.map((n) => (
              <Link key={n.href} className="nav-link" href={n.href} aria-current={isActive(n.href) ? 'page' : undefined}>{n.label}</Link>
            ))}
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link className="btn nav-cta" href="/contact#inquiry" style={{ minHeight: 46, padding: '0 22px' }}>Inquire Now</Link>
            {settings.phoneHref && (
              <a className="btn btn-ghost nav-toggle" href={settings.phoneHref} aria-label={`Call ${settings.hotelName}`} style={{ minHeight: 44, minWidth: 44, padding: '0 12px' }}><PhoneIcon /></a>
            )}
            <button ref={toggleRef} type="button" className="btn btn-ghost nav-toggle" aria-label="Open menu" aria-expanded={menu} aria-controls="mobile-menu" onClick={() => setMenu(true)} style={{ minHeight: 44, minWidth: 44, padding: '0 12px' }}>
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>

      {menu && (
        <div
          id="mobile-menu" role="dialog" aria-modal="true" aria-label="Site menu"
          onKeyDown={(e) => { if (e.key === 'Escape') setMenu(false); }}
          style={{ position: 'fixed', inset: 0, zIndex: 80, background: '#292A27', color: '#F8F6F0', display: 'flex', flexDirection: 'column', padding: '20px clamp(20px,6vw,48px) 32px', overflowY: 'auto' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 64 }}>
            <span className="serif" style={{ fontSize: 26 }}>{settings.hotelName}</span>
            <button ref={closeRef} type="button" className="icon-btn" aria-label="Close menu" onClick={() => setMenu(false)}><CloseIcon /></button>
          </div>
          <nav aria-label="Mobile" style={{ display: 'flex', flexDirection: 'column', marginTop: 32 }}>
            {NAV.map((n) => (
              <Link key={n.href} className="mlink" href={n.href} aria-current={isActive(n.href) ? 'page' : undefined} onClick={() => setMenu(false)}>
                {n.label}<span aria-hidden="true" style={{ fontSize: 20 }}>→</span>
              </Link>
            ))}
          </nav>
          <div style={{ marginTop: 'auto', paddingTop: 40, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Link className="btn btn-light" href="/contact#inquiry" style={{ width: '100%' }} onClick={() => setMenu(false)}>Inquire About Reservations</Link>
            {settings.phoneHref && <a className="btn btn-outline-light" href={settings.phoneHref} style={{ width: '100%' }}>Call {settings.phone}</a>}
            <p style={{ fontSize: 13, color: '#B5B0A5', textAlign: 'center', marginTop: 8 }}>{settings.addressLine1}, {settings.city}, {settings.region} {settings.postalCode}</p>
          </div>
        </div>
      )}
    </>
  );
}
