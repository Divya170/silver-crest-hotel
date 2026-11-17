'use client';

import { EntityManager } from '@/components/admin/EntityManager';
import { mediaUrl } from '@/lib/api';

export default function RoomsAdmin() {
  return (
    <EntityManager
      title="Rooms"
      singular="Room"
      subtitle="Room categories shown on the Rooms page, the homepage preview and in the inquiry form. Only add details the hotel has confirmed."
      endpoint="/admin/rooms"
      searchPlaceholder="Search room names or descriptions…"
      filters={[{ name: 'status', label: 'Status', options: [{ value: 'published', label: 'Published' }, { value: 'hidden', label: 'Hidden' }] }]}
      defaults={{ name: '', description: '', facilities: '', imageAlt: '', occupancyNote: '', sizeNote: '', rateNote: '', clientNote: '', published: true }}
      fields={[
        { name: 'name', label: 'Room category name', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'facilities', label: 'Confirmed facilities (one per line)', type: 'list', help: 'Only facilities the hotel has confirmed for this room.' },
        { name: 'occupancyNote', label: 'Occupancy (optional)', type: 'text', nullable: true, help: 'e.g. “Up to 2 guests”. Leave blank to hide.' },
        { name: 'sizeNote', label: 'Size (optional)', type: 'text', nullable: true, help: 'Leave blank to hide.' },
        { name: 'rateNote', label: 'Rates note (optional)', type: 'text', nullable: true, help: 'e.g. “Rates on request”. Leave blank to hide. Never shows availability.' },
        { name: 'imageAlt', label: 'Photo description (alt text)', type: 'text' },
        { name: 'clientNote', label: '“Client to supply” note', type: 'textarea', nullable: true, help: 'Shown on the site as a dashed placeholder note. Clear it once the real content is in.' },
        { name: 'sortOrder', label: 'Display order', type: 'number' },
        { name: 'published', label: 'Published', type: 'boolean', help: 'Hidden rooms disappear from the site and the inquiry form.' },
      ]}
      columns={[
        { label: 'Photo', render: (r) => (r.imageUrl ? <img className="thumb" src={mediaUrl(r.imageUrl) ?? ''} alt="" /> : <div className="thumb-ph" />) }, // eslint-disable-line @next/next/no-img-element
        { label: 'Name', render: (r) => <><strong>{r.name}</strong>{r.clientNote && <> <span className="pill pill-todo">Needs content</span></>}</> },
        { label: 'Facilities', render: (r) => (r.facilities?.length ? `${r.facilities.length}` : '—') },
        { label: 'Order', render: (r) => r.sortOrder },
        { label: 'Status', render: (r) => <span className={`pill ${r.published ? 'pill-on' : 'pill-off'}`}>{r.published ? 'Published' : 'Hidden'}</span> },
      ]}
      image={{ getUrl: (r) => r.imageUrl }}
      emptyText="No rooms yet. Add the hotel’s first room category."
      rowLabel={(r) => r.name}
    />
  );
}
