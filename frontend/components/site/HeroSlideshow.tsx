'use client';

import { useEffect, useState } from 'react';
import { mediaUrl } from '@/lib/api';
import type { ContentBlock } from '@/lib/types';
import { PauseIcon, PlayIcon } from './Icons';

const TONES = ['#3A3B37', '#33342F', '#423F39'];

/**
 * Hero background cross-fade (comp: 1.8s fade, 5–8s interval, pause on hover / button,
 * respects prefers-reduced-motion). Text and CTAs live outside and never move.
 */
export function HeroSlideshow({ slides, autoplay, intervalSeconds, children }: { slides: ContentBlock[]; autoplay: boolean; intervalSeconds: number; children: React.ReactNode }) {
  const count = Math.max(1, slides.length);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(!autoplay);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) setPaused(true);
  }, []);

  useEffect(() => {
    if (paused || hover || count < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), Math.min(8, Math.max(5, intervalSeconds)) * 1000);
    return () => clearInterval(t);
  }, [paused, hover, count, intervalSeconds]);

  const current = slides[index];
  const anyReal = slides.some((s) => s.fields?.imageUrl);

  return (
    <section
      aria-label="Welcome"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      style={{ position: 'relative', minHeight: 'clamp(580px, 88vh, 900px)', display: 'flex', alignItems: 'flex-end', color: '#F8F6F0', overflow: 'hidden', background: '#292A27' }}
    >
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
        {(slides.length ? slides : [null]).map((s, i) => {
          const url = mediaUrl(s?.fields?.imageUrl);
          return (
            <div key={s?.id ?? i} style={{ position: 'absolute', inset: 0, opacity: i === index ? 1 : 0, transition: 'opacity 1.8s ease', overflow: 'hidden' }}>
              {url ? (
                <div className="kb" style={{ position: 'absolute', inset: '-2%' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="cover" src={url} alt="" loading={i === 0 ? 'eager' : 'lazy'} fetchPriority={i === 0 ? 'high' : 'auto'} />
                </div>
              ) : (
                <div className="ph ph-dark kb" style={{ position: 'absolute', inset: '-2%', backgroundColor: TONES[i % TONES.length] }} />
              )}
            </div>
          );
        })}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(24,24,22,0.25) 0%, rgba(24,24,22,0.15) 40%, rgba(24,24,22,0.7) 100%)' }} />
      </div>
      {current && !current.fields?.imageUrl && (
        <p className="ph-tag" style={{ top: 104, bottom: 'auto', left: 'auto', right: 'clamp(20px,5vw,72px)' }}>Photo placeholder · {current.title}</p>
      )}
      {current?.fields?.imageUrl && <p className="sr" aria-live="polite">{current.fields.alt || current.title}</p>}
      {children}
      {count > 1 && (
        <div style={{ position: 'absolute', right: 'clamp(20px,5vw,72px)', bottom: 'clamp(24px,4vw,48px)', display: 'flex', alignItems: 'center', gap: 10 }}>
          {slides.map((s, i) => (
            <button
              key={s.id} type="button" aria-label={`Show photo ${i + 1} of ${count}: ${s.title}`} aria-pressed={i === index}
              onClick={() => { setIndex(i); setPaused(true); }}
              style={{ width: 44, height: 44, border: 0, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
            >
              <span style={{ display: 'block', width: 28, height: 2, background: i === index ? '#F8F6F0' : 'rgba(248,246,240,0.4)', transition: 'background .4s' }} />
            </button>
          ))}
          <button type="button" className="icon-btn" onClick={() => setPaused((p) => !p)} aria-label={paused ? 'Play slideshow' : 'Pause slideshow'} style={{ marginLeft: 6 }}>
            {paused ? <PlayIcon /> : <PauseIcon />}
          </button>
        </div>
      )}
      {!anyReal && <span className="sr">Hotel photographs coming soon.</span>}
    </section>
  );
}
