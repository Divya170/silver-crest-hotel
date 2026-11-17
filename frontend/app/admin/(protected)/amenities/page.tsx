'use client';

import { useEffect, useState } from 'react';
import { EntityManager } from '@/components/admin/EntityManager';
import { mediaUrl } from '@/lib/api';
import { adminFetch } from '@/lib/admin-api';

export default function AmenitiesAdmin() {
  const [meta, setMeta] = useState<{ icons: string[]; groups: string[] }>({ icons: [], groups: [] });
  useEffect(() => { adminFetch<{ icons: string[]; groups: string[] }>('/admin/amenities/meta').then(setMeta).catch(() => undefined); }, []);
  return (
    <EntityManager
      title="Amenities"
      singular="Amenity"
      subtitle="Only facilities the hotel has confirmed. Until at least one is published, the site shows the “awaiting confirmation” placeholder."
      endpoint="/admin/amenities"
      searchPlaceholder="Search amenities…"
      filters={meta.groups.length ? [{ name: 'group', label: 'Group', options: meta.groups.map((g) => ({ value: g, label: g })) }] : []}
      defaults={{ name: '', description: '', groupName: meta.groups[0] ?? 'In your room', icon: '', imageAlt: '', featured: false, published: true }}
      fields={[
        { name: 'name', label: 'Amenity name', type: 'text', required: true },
        { name: 'description', label: 'Short description', type: 'textarea' },
        { name: 'groupName', label: 'Group', type: 'text', required: true, help: `Existing groups: ${meta.groups.join(', ') || 'none yet'}. Suggested: In your room, Around the hotel, Services.` },
        { name: 'icon', label: 'Icon', type: 'select', nullable: true, options: [{ value: '', label: 'No icon' }, ...meta.icons.map((i) => ({ value: i, label: i }))] },
        { name: 'imageAlt', label: 'Photo description (alt text)', type: 'text' },
        { name: 'featured', label: 'Featured amenity', type: 'boolean', help: 'Gets the large photo block on the Amenities page. Only one can be featured.' },
        { name: 'sortOrder', label: 'Display order', type: 'number' },
        { name: 'published', label: 'Published', type: 'boolean' },
      ]}
      columns={[
        { label: 'Name', render: (r) => <><strong>{r.name}</strong>{r.featured && <> <span className="pill">Featured</span></>}</> },
        { label: 'Group', render: (r) => r.groupName },
        { label: 'Icon', render: (r) => r.icon || '—' },
        { label: 'Photo', render: (r) => (r.imageUrl ? <img className="thumb" src={mediaUrl(r.imageUrl) ?? ''} alt="" /> : '—') }, // eslint-disable-line @next/next/no-img-element
        { label: 'Status', render: (r) => <span className={`pill ${r.published ? 'pill-on' : 'pill-off'}`}>{r.published ? 'Published' : 'Hidden'}</span> },
      ]}
      image={{ getUrl: (r) => r.imageUrl }}
      emptyText="No amenities confirmed yet. Add one once the hotel confirms it."
      rowLabel={(r) => r.name}
    />
  );
}
