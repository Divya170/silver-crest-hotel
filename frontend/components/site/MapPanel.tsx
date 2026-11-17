import type { SiteSettings } from '@/lib/types';
import { PinIcon } from './Icons';

/** Live Google Maps embed when an embed URL is set in Settings; otherwise the comp's map placeholder (links stay real). */
export function MapPanel({ settings, minHeight = 460 }: { settings: SiteSettings; minHeight?: number }) {
  if (settings.mapEmbedUrl) {
    return (
      <div style={{ position: 'relative', minHeight, background: '#E7E2D8' }}>
        <iframe className="map-frame" src={settings.mapEmbedUrl} title={`Map showing ${settings.hotelName}, ${settings.fullAddress}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      </div>
    );
  }
  return (
    <div className="ph" style={{ minHeight, backgroundColor: '#E7E2D8' }}>
      <svg aria-hidden="true" width="100%" height="100%" viewBox="0 0 600 460" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0 }}>
        <g stroke="#C9C2B4" strokeWidth="10" fill="none"><path d="M-20 140 H620" /><path d="M-20 330 H620" /><path d="M180 -20 V480" /><path d="M430 -20 V480" /></g>
        <g stroke="#D6D0C4" strokeWidth="4" fill="none"><path d="M-20 60 L620 260" /><path d="M300 -20 V480" /><path d="M-20 240 H620" /></g>
      </svg>
      <a href={settings.mapsUrl} aria-label={`Open ${settings.hotelName} in Google Maps`} style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
        <span style={{ background: '#292A27', color: '#F8F6F0', fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 600, padding: '8px 12px', whiteSpace: 'nowrap' }}>{settings.hotelName}</span>
        <PinIcon />
      </a>
      <p className="ph-tag">Map preview · add a Google Maps embed URL in Settings for an interactive map</p>
    </div>
  );
}
