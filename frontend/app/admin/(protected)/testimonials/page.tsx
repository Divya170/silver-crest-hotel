'use client';

import { EntityManager } from '@/components/admin/EntityManager';

export default function TestimonialsAdmin() {
  return (
    <EntityManager
      title="Testimonials"
      singular="Testimonial"
      subtitle="Real guest words only, used with permission. They appear on the homepage when “Show testimonials” is on in Settings and at least one verified testimonial is published."
      endpoint="/admin/testimonials"
      searchPlaceholder="Search quotes or guest names…"
      defaults={{ quote: '', guestName: '', context: '', verified: false, published: false }}
      fields={[
        { name: 'quote', label: 'Guest’s words', type: 'textarea', required: true },
        { name: 'guestName', label: 'Credited as', type: 'text', required: true, help: 'Exactly as the guest agreed to be named.' },
        { name: 'context', label: 'Context (optional)', type: 'text', nullable: true, help: 'e.g. “Stayed in March 2026”.' },
        { name: 'verified', label: 'Verified', type: 'boolean', help: 'I confirm this is a genuine guest testimonial and we have permission to publish it.' },
        { name: 'published', label: 'Published', type: 'boolean', help: 'Requires “Verified”.' },
        { name: 'sortOrder', label: 'Display order', type: 'number' },
      ]}
      columns={[
        { label: 'Quote', render: (r) => <span style={{ display: 'block', maxWidth: 420 }}>“{String(r.quote).slice(0, 120)}{String(r.quote).length > 120 ? '…' : ''}”</span> },
        { label: 'Guest', render: (r) => r.guestName },
        { label: 'Verified', render: (r) => (r.verified ? 'Yes' : <span className="pill pill-todo">No</span>) },
        { label: 'Status', render: (r) => <span className={`pill ${r.published ? 'pill-on' : 'pill-off'}`}>{r.published ? 'Published' : 'Hidden'}</span> },
      ]}
      emptyText="No testimonials yet. Add one only when a guest has given permission."
      rowLabel={(r) => r.guestName}
    />
  );
}
