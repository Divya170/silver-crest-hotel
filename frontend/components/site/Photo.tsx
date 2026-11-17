import { mediaUrl } from '@/lib/api';

interface Props {
  src?: string | null;
  alt: string;
  /** Label for the placeholder tag while no real photo exists. */
  label: string;
  className?: string;
  style?: React.CSSProperties;
  dark?: boolean;
  tone?: string;
  zoom?: boolean;
  kenBurns?: boolean;
  priority?: boolean;
  /** Hide the placeholder tag (for small decorative tiles). */
  shortTag?: string;
  children?: React.ReactNode;
}

/**
 * Real photograph when the hotel has uploaded one; otherwise the comp's hatched placeholder
 * panel with a clear "Photo placeholder" tag — never stock imagery.
 */
export function Photo({ src, alt, label, className = '', style, dark, tone, zoom, kenBurns, priority, shortTag, children }: Props) {
  const url = mediaUrl(src);
  const inner = [zoom ? 'zoom' : '', kenBurns ? 'kb' : ''].filter(Boolean).join(' ');
  return (
    <div className={`ph ${dark ? 'ph-dark' : ''} ${url ? 'has-img' : ''} ${className}`} style={{ ...(tone && !url ? { backgroundColor: tone } : {}), ...style }}>
      {url ? (
        <div className={inner} style={{ position: 'absolute', inset: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="cover" src={url} alt={alt} loading={priority ? 'eager' : 'lazy'} decoding="async" fetchPriority={priority ? 'high' : 'auto'} />
        </div>
      ) : (
        <>
          {inner && <div className={`ph ${dark ? 'ph-dark' : ''} ${inner}`} aria-hidden="true" style={{ position: 'absolute', inset: kenBurns ? '-2%' : 0, ...(tone ? { backgroundColor: tone } : {}) }} />}
          <p className="ph-tag">{shortTag ?? `Photo placeholder · ${label}`}</p>
        </>
      )}
      {children}
    </div>
  );
}
