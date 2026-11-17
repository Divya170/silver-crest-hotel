import Link from 'next/link';
import { formatDate } from '@/lib/validation';
import type { InquiryReceipt, SiteSettings } from '@/lib/types';
import { CheckCircle } from './Icons';

/** Shown after a REAL successful submission (201 from the API) — with clear next actions. */
export function SuccessCard({ receipt, settings, onReset }: { receipt: InquiryReceipt; settings: SiteSettings; onReset: () => void }) {
  return (
    <div className="success-card" tabIndex={-1} id="inquiry-success">
      <CheckCircle />
      <p className="serif" style={{ fontSize: 34, lineHeight: 1.1, marginTop: 18 }}>Inquiry received</p>
      <p className="lead" style={{ marginTop: 14 }}>
        Thank you for contacting {settings.hotelName}. Your reservation inquiry has been submitted successfully. Our team will review your request and get back to you.
      </p>
      <dl>
        <dt>Reference</dt><dd>{receipt.reference}</dd>
        <dt>Stay</dt><dd>{formatDate(receipt.checkIn)} → {formatDate(receipt.checkOut)} · {receipt.nights} {receipt.nights === 1 ? 'night' : 'nights'}</dd>
        <dt>Guests</dt><dd>{receipt.guests}</dd>
        {receipt.roomName && <><dt>Room</dt><dd>{receipt.roomName}</dd></>}
        <dt>Reply to</dt><dd style={{ wordBreak: 'break-all' }}>{receipt.email}</dd>
      </dl>
      <p className="hint" style={{ marginTop: 16 }}>This is not yet a confirmed reservation. Your stay is confirmed only when the hotel contacts you. Keep your reference handy if you call.</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 28 }}>
        <Link className="btn" href="/">Back to Home <span className="arr" aria-hidden="true">→</span></Link>
        <Link className="btn btn-ghost" href="/gallery">Explore the Gallery</Link>
        <button type="button" className="btn btn-ghost" onClick={onReset}>Send Another Inquiry</button>
      </div>
      {settings.phoneHref && (
        <p className="hint" style={{ marginTop: 18 }}>Need an answer sooner? <a href={settings.phoneHref}>Call {settings.phone}</a></p>
      )}
    </div>
  );
}
