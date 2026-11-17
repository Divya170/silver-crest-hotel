'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { mediaUrl } from '@/lib/api';
import type { GalleryItem } from '@/lib/types';
import { ChevronLeft, ChevronRight, CloseIcon } from './Icons';

const CATS = ['All', 'Exterior', 'Rooms', 'Common Areas', 'Facilities'] as const;

export function GalleryBrowser({ items, initialCategory = 'All' }: { items: GalleryItem[]; initialCategory?: string }) {
  const [cat, setCat] = useState<string>(CATS.includes(initialCategory as (typeof CATS)[number]) ? initialCategory : 'All');
  const [open, setOpen] = useState(-1);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);

  const shown = cat === 'All' ? items : items.filter((i) => i.category === cat);
  const n = shown.length;
  const counts = Object.fromEntries(CATS.map((c) => [c, c === 'All' ? items.length : items.filter((i) => i.category === c).length]));

  const pick = (c: string) => {
    setCat(c);
    setOpen(-1);
    const url = new URL(window.location.href);
    if (c === 'All') url.searchParams.delete('category');
    else url.searchParams.set('category', c);
    window.history.replaceState(null, '', url.toString());
  };

  const go = useCallback((d: number) => setOpen((o) => (n ? (o + d + n) % n : -1)), [n]);
  const close = useCallback(() => {
    setOpen(-1);
    setTimeout(() => lastTrigger.current?.focus(), 0);
  }, []);

  useEffect(() => {
    if (open < 0) return;
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open >= 0]); // eslint-disable-line react-hooks/exhaustive-deps

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    else if (e.key === 'Tab') {
      // keep focus inside the dialog
      const nodes = (e.currentTarget as HTMLElement).querySelectorAll<HTMLElement>('button');
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };

  const lb = open >= 0 ? shown[open] : null;
  const lbUrl = mediaUrl(lb?.imageUrl);

  return (
    <>
      <div role="group" aria-label="Filter photos by category" style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 'clamp(28px, 3.5vw, 44px)' }}>
        {CATS.map((c) => (
          <button key={c} type="button" className="chip" aria-pressed={cat === c} onClick={() => pick(c)}>
            {c} <span style={{ opacity: 0.65, marginLeft: 4 }}>{counts[c]}</span>
          </button>
        ))}
      </div>
      <p className="sr" aria-live="polite">{n} photos shown{cat === 'All' ? '' : ` in ${cat}`}</p>

      {n > 0 ? (
        <ul className="gal-grid">
          {shown.map((it, i) => {
            const url = mediaUrl(it.imageUrl);
            return (
              <li key={it.id} style={{ gridRow: `span ${it.rows}`, gridColumn: `span ${it.cols}` }}>
                <button
                  type="button"
                  className={`ph zoom-host gal-tile ${url ? 'has-img' : ''}`}
                  style={{ backgroundColor: url ? undefined : it.tone }}
                  aria-label={`Open photo ${i + 1} of ${n}: ${it.title} (${it.category})`}
                  onClick={(e) => { lastTrigger.current = e.currentTarget; setOpen(i); }}
                >
                  {url ? (
                    <span className="zoom" style={{ position: 'absolute', inset: 0 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className="cover" src={url} alt={it.alt || it.title} loading="lazy" decoding="async" />
                    </span>
                  ) : (
                    <span className="ph zoom" aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundColor: it.tone }} />
                  )}
                  <span className="ph-tag">{url ? `${it.category} · ${it.title}` : `Placeholder · ${it.category} · ${it.title}`}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="empty-state">
          <p className="serif" style={{ fontSize: 34 }}>No {cat === 'All' ? '' : `${cat.toLowerCase()} `}photographs yet</p>
          <p className="hint" style={{ marginTop: 10 }}>This category appears once the hotel adds real photographs for it.</p>
          {cat !== 'All' && <button type="button" className="btn btn-ghost" onClick={() => pick('All')} style={{ marginTop: 28 }}>Show All Photos</button>}
        </div>
      )}

      {lb && (
        <div
          className="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer" onKeyDown={onKey}
          onTouchStart={(e) => { touchX.current = e.changedTouches[0]?.clientX ?? null; }}
          onTouchEnd={(e) => {
            if (touchX.current == null) return;
            const dx = (e.changedTouches[0]?.clientX ?? touchX.current) - touchX.current;
            touchX.current = null;
            if (Math.abs(dx) > 48) go(dx < 0 ? 1 : -1);
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, minHeight: 56 }}>
            <p style={{ fontSize: 13, letterSpacing: '.14em', textTransform: 'uppercase', color: '#DCD7CD' }} aria-live="polite">{open + 1} / {n}</p>
            <button ref={closeRef} type="button" className="icon-btn" onClick={close} aria-label="Close photo viewer"><CloseIcon /></button>
          </div>
          <div className="lightbox-stage">
            <button type="button" className="icon-btn lb-side" onClick={() => go(-1)} aria-label="Previous photo" style={{ flex: 'none' }}><ChevronLeft /></button>
            <figure>
              <div key={lb.id} className={`frame ph ${lbUrl ? 'has-img' : ''}`} style={{ backgroundColor: lbUrl ? 'transparent' : lb.tone }}>
                {lbUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="cover" src={lbUrl} alt={lb.alt || lb.title} />
                ) : (
                  <span className="ph-tag">Photo placeholder · {lb.category}</span>
                )}
              </div>
              <figcaption className="serif" style={{ fontSize: 24, color: '#F8F6F0' }}>{lb.title}</figcaption>
            </figure>
            <button type="button" className="icon-btn lb-side" onClick={() => go(1)} aria-label="Next photo" style={{ flex: 'none' }}><ChevronRight /></button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, paddingTop: 12, alignItems: 'center' }}>
            <button type="button" className="icon-btn lb-mobile" onClick={() => go(-1)} aria-label="Previous photo"><ChevronLeft /></button>
            <p style={{ textAlign: 'center', fontSize: 12, color: '#B5B0A5' }}>Use arrow keys or swipe to browse · Esc to close</p>
            <button type="button" className="icon-btn lb-mobile" onClick={() => go(1)} aria-label="Next photo"><ChevronRight /></button>
          </div>
        </div>
      )}
    </>
  );
}
