'use client';

import { EntityManager } from '@/components/admin/EntityManager';
import { mediaUrl } from '@/lib/api';

const CATS = ['Exterior', 'Rooms', 'Common Areas', 'Facilities'].map((c) => ({ value: c, label: c }));

export default function GalleryAdmin() {
  return (
    <EntityManager
      title="Gallery"
      singular="Photo"
      subtitle="Photos on the Gallery page, the homepage collage and the About page. Items without an uploaded photo show as labelled placeholders."
      endpoint="/admin/gallery"
      searchPlaceholder="Search photo titles…"
      filters={[{ name: 'category', label: 'Category', options: CATS }]}
      defaults={{ title: '', category: 'Rooms', alt: '', rows: 2, cols: 1, tone: '#DCD7CD', featuredOnHome: false, published: true }}
      fields={[
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'category', label: 'Category', type: 'select', options: CATS, required: true },
        { name: 'alt', label: 'Photo description (alt text)', type: 'text', help: 'Describe what the photo shows for screen-reader users.' },
        { name: 'rows', label: 'Tile height (1–3 rows)', type: 'number' },
        { name: 'cols', label: 'Tile width (1–2 columns)', type: 'number' },
        { name: 'tone', label: 'Placeholder tint', type: 'color', help: 'Only used while no photo is uploaded.' },
        { name: 'featuredOnHome', label: 'Show in the homepage collage', type: 'boolean', help: 'The first four featured photos are used.' },
        { name: 'sortOrder', label: 'Display order', type: 'number' },
        { name: 'published', label: 'Published', type: 'boolean' },
      ]}
      columns={[
        { label: 'Photo', render: (r) => (r.imageUrl ? <img className="thumb" src={mediaUrl(r.imageUrl) ?? ''} alt="" /> : <div className="thumb-ph" />) }, // eslint-disable-line @next/next/no-img-element
        { label: 'Title', render: (r) => <><strong>{r.title}</strong>{!r.imageUrl && <> <span className="pill pill-todo">Placeholder</span></>}</> },
        { label: 'Category', render: (r) => r.category },
        { label: 'Home', render: (r) => (r.featuredOnHome ? 'Yes' : '—') },
        { label: 'Status', render: (r) => <span className={`pill ${r.published ? 'pill-on' : 'pill-off'}`}>{r.published ? 'Published' : 'Hidden'}</span> },
      ]}
      image={{ getUrl: (r) => r.imageUrl }}
      emptyText="No gallery photos yet."
      rowLabel={(r) => r.title}
    />
  );
}
