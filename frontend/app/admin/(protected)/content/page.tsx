'use client';

import { EntityManager } from '@/components/admin/EntityManager';
import { mediaUrl } from '@/lib/api';

const TYPES = [
  { value: 'page_copy', label: 'Page copy' },
  { value: 'hero_slide', label: 'Homepage hero slide' },
  { value: 'why_theme', label: '“Why stay” theme' },
  { value: 'philosophy', label: 'Hospitality philosophy' },
];
const typeLabel = (t: string) => TYPES.find((x) => x.value === t)?.label ?? t;
const IMAGE_KEYS = ['home_welcome', 'home_experience', 'rooms_hero', 'amenities_hero', 'about_hero'];

export default function ContentAdmin() {
  return (
    <EntityManager
      title="Page content"
      singular="Content block"
      subtitle="Headings, paragraphs, hero slides and editorial lists across the site. Clear a “Client to supply” note once the real copy is approved."
      endpoint="/admin/content"
      searchPlaceholder="Search titles, text or keys…"
      filters={[{ name: 'type', label: 'Type', options: TYPES }]}
      defaults={{ type: 'why_theme', key: '', title: '', body: '', fields: { eyebrow: '', clientNote: '', alt: '' }, published: true }}
      fields={[
        { name: 'type', label: 'Type', type: 'select', options: TYPES, createOnly: true, required: true },
        { name: 'key', label: 'Key', type: 'text', nullable: true, createOnly: true, showIf: (v) => v.type === 'page_copy', help: 'Page copy is looked up by key (e.g. home_hero). Existing keys are already created.' },
        { name: 'title', label: 'Title / heading', type: 'textarea', required: true },
        { name: 'body', label: 'Body text', type: 'textarea', nullable: true },
        { name: 'fields.eyebrow', label: 'Small label above the heading', type: 'text' },
        { name: 'fields.alt', label: 'Photo description (alt text)', type: 'text', showIf: (v) => v.type === 'hero_slide' },
        { name: 'fields.clientNote', label: '“Client to supply” note', type: 'textarea', help: 'Shown on the site as a dashed placeholder note. Clear it to hide.' },
        { name: 'sortOrder', label: 'Display order', type: 'number' },
        { name: 'published', label: 'Published', type: 'boolean' },
      ]}
      columns={[
        { label: 'Type', render: (r) => typeLabel(r.type) },
        { label: 'Key', render: (r) => (r.key ? <code style={{ fontSize: 12 }}>{r.key}</code> : '—') },
        { label: 'Title', render: (r) => <><span style={{ display: 'block', maxWidth: 420 }}>{String(r.title).slice(0, 90)}</span>{r.fields?.clientNote && <span className="pill pill-todo">Needs content</span>}</> },
        { label: 'Photo', render: (r) => (r.fields?.imageUrl ? <img className="thumb" src={mediaUrl(r.fields.imageUrl) ?? ''} alt="" /> : r.type === 'hero_slide' || IMAGE_KEYS.includes(r.key) ? <div className="thumb-ph" /> : '—') }, // eslint-disable-line @next/next/no-img-element
        { label: 'Status', render: (r) => <span className={`pill ${r.published ? 'pill-on' : 'pill-off'}`}>{r.published ? 'Published' : 'Hidden'}</span> },
      ]}
      image={{ getUrl: (r) => r.fields?.imageUrl, removable: false, hint: 'Used by hero slides and page sections that show a photo (home welcome & experience, page heroes). Upload genuine hotel photos only.' }}
      emptyText="No content blocks."
      rowLabel={(r) => (r.key ? `${typeLabel(r.type)} · ${r.key}` : `${typeLabel(r.type)} · ${String(r.title).slice(0, 40)}`)}
    />
  );
}
