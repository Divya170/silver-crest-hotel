'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ApiError, apiFetch } from '@/lib/api';
import type { InquiryReceipt, Room, SiteSettings } from '@/lib/types';
import { FIELD_ORDER, InquiryForm as FormShape, localToday, nextDay, nightsBetween, validateInquiry, formatDate } from '@/lib/validation';
import { InfoIcon } from './Icons';
import { useRoomSelection } from './RoomSelection';
import { SuccessCard } from './SuccessCard';

type Status = 'idle' | 'invalid' | 'sending' | 'failed' | 'success';
type Field = keyof FormShape;

const EMPTY: FormShape = { roomId: '', checkIn: '', checkOut: '', guests: '2', name: '', email: '', phone: '', message: '' };

export function InquiryForm({ rooms, settings, source, initialRoomId = '' }: { rooms: Room[]; settings: SiteSettings; source: 'rooms' | 'contact'; initialRoomId?: string }) {
  const sel = useRoomSelection();
  const validInitial = rooms.some((r) => String(r.id) === initialRoomId) ? initialRoomId : '';
  const [f, setF] = useState<FormShape>({ ...EMPTY, roomId: validInitial });
  const [seen, setSeen] = useState<Partial<Record<Field, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [serverErrors, setServerErrors] = useState<Partial<Record<Field, string>>>({});
  const [failure, setFailure] = useState('');
  const [receipt, setReceipt] = useState<InquiryReceipt | null>(null);
  const [today, setToday] = useState('');
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => setToday(localToday()), []);

  // Room picked elsewhere on the page (Rooms page buttons) flows into the form.
  useEffect(() => {
    if (sel && sel.roomId !== f.roomId && (sel.roomId === '' || rooms.some((r) => String(r.id) === sel.roomId))) setF((p) => ({ ...p, roomId: sel.roomId }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sel?.roomId]);

  const clientErrors = useMemo(() => validateInquiry(f), [f]);
  const errorFor = (k: Field) => serverErrors[k] || ((submitted || seen[k]) && clientErrors[k]) || '';
  const errCount = FIELD_ORDER.filter((k) => errorFor(k)).length + (serverErrors.roomId ? 1 : 0);
  const nights = f.checkIn && f.checkOut && f.checkOut > f.checkIn ? nightsBetween(f.checkIn, f.checkOut) : 0;
  const room = rooms.find((r) => String(r.id) === f.roomId);

  const set = (k: Field, v: string) => {
    setF((p) => ({ ...p, [k]: v }));
    if (serverErrors[k]) setServerErrors((p) => ({ ...p, [k]: undefined }));
    if (status === 'failed' || status === 'invalid') setStatus('idle');
    if (k === 'roomId' && sel) sel.setRoomId(v);
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => set(e.target.name as Field, e.target.value);
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => setSeen((p) => ({ ...p, [e.target.name]: true }));
  const guestsNum = parseInt(f.guests, 10) || 0;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setFailure('');
    const errs = validateInquiry(f);
    const first = FIELD_ORDER.find((k) => errs[k]);
    if (first) {
      setStatus('invalid');
      setTimeout(() => document.getElementById(`fld-${first}`)?.focus(), 0);
      return;
    }
    setStatus('sending');
    try {
      const res = await apiFetch<InquiryReceipt>('/inquiries', {
        method: 'POST',
        body: JSON.stringify({ ...f, roomId: f.roomId || null, guests: Number(f.guests), source }),
      });
      setReceipt(res);
      setStatus('success');
      setTimeout(() => successRef.current?.querySelector<HTMLElement>('#inquiry-success')?.focus(), 0);
    } catch (err) {
      if (err instanceof ApiError && err.status === 400 && Object.keys(err.fieldErrors).length) {
        const mapped: Partial<Record<Field, string>> = {};
        for (const [k, v] of Object.entries(err.fieldErrors)) mapped[(k as Field) in EMPTY ? (k as Field) : 'message'] = v;
        setServerErrors(mapped);
        setStatus('invalid');
        const firstServer = (['roomId', ...FIELD_ORDER] as Field[]).find((k) => mapped[k]);
        if (firstServer) setTimeout(() => document.getElementById(`fld-${firstServer}`)?.focus(), 0);
      } else {
        setFailure(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        setStatus('failed');
      }
    }
  }

  function reset() {
    setF({ ...EMPTY });
    setSeen({});
    setSubmitted(false);
    setServerErrors({});
    setReceipt(null);
    setStatus('idle');
    sel?.setRoomId('');
  }

  if (status === 'success' && receipt) {
    return (
      <div ref={successRef} aria-live="polite">
        <SuccessCard receipt={receipt} settings={settings} onReset={reset} />
      </div>
    );
  }

  const describe = (k: Field, hint = false) => [errorFor(k) ? `${k}-err` : '', hint ? `${k}-hint` : ''].filter(Boolean).join(' ') || undefined;
  const Err = ({ k }: { k: Field }) => (errorFor(k) ? <p id={`${k}-err`} className="err">{errorFor(k)}</p> : null);
  const Req = () => <span className="req" aria-hidden="true">*</span>;

  return (
    <>
      <div aria-live="polite" role="status">
        {status === 'failed' && (
          <div role="alert" className="notice-error" style={{ marginBottom: 32 }}>
            <p style={{ fontWeight: 600 }}>We couldn’t send your inquiry.</p>
            <p className="hint" style={{ marginTop: 6, color: '#55544F' }}>
              {failure} Your details are still here — please try again{settings.phoneHref || settings.emailHref ? ', or contact the hotel directly' : ''}
              {settings.phoneHref && <> on <a href={settings.phoneHref}>{settings.phone}</a></>}
              {settings.emailHref && <> or <a href={settings.emailHref}>{settings.email}</a></>}.
            </p>
          </div>
        )}
      </div>
      <form noValidate onSubmit={onSubmit} aria-label="Reservation inquiry" style={{ display: 'flex', flexDirection: 'column', gap: 44 }}>
        {status === 'invalid' && errCount > 0 && (
          <div role="alert" style={{ padding: '14px 16px', border: '1px solid #A23B2A', background: '#FBF1EE', fontSize: 14, color: '#7E2A1D', fontWeight: 600 }}>
            {errCount === 1 ? 'Please fix 1 field before sending your inquiry.' : `Please fix ${errCount} fields before sending your inquiry.`}
          </div>
        )}

        <fieldset style={{ border: 0, padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 22, minWidth: 0 }}>
          <legend className="eyebrow" style={{ padding: 0, marginBottom: 22 }}>01 · Your stay</legend>
          {rooms.length > 0 && (
            <div className="field">
              <label htmlFor="fld-roomId">Room category <span style={{ fontWeight: 400, color: '#55544F' }}>(optional)</span></label>
              <select id="fld-roomId" name="roomId" className="input" value={f.roomId} onChange={onChange} aria-invalid={!!serverErrors.roomId} aria-describedby={serverErrors.roomId ? 'roomId-err' : undefined}>
                <option value="">No preference / not sure yet</option>
                {rooms.map((r) => <option key={r.id} value={String(r.id)}>{r.name}</option>)}
              </select>
              <Err k="roomId" />
            </div>
          )}
          <div className="g-collapse" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 22 }}>
            <div className="field">
              <label htmlFor="fld-checkIn">Check-in date <Req /></label>
              <input id="fld-checkIn" name="checkIn" type="date" className="input" required min={today || undefined} value={f.checkIn} onChange={onChange} onBlur={onBlur} aria-invalid={!!errorFor('checkIn')} aria-describedby={describe('checkIn')} />
              <Err k="checkIn" />
            </div>
            <div className="field">
              <label htmlFor="fld-checkOut">Check-out date <Req /></label>
              <input id="fld-checkOut" name="checkOut" type="date" className="input" required min={f.checkIn ? nextDay(f.checkIn) : today ? nextDay(today) : undefined} value={f.checkOut} onChange={onChange} onBlur={onBlur} aria-invalid={!!errorFor('checkOut')} aria-describedby={describe('checkOut')} />
              <Err k="checkOut" />
            </div>
          </div>
          {nights > 0 && <p className="hint" style={{ marginTop: -8 }}>{nights} {nights === 1 ? 'night' : 'nights'} · {formatDate(f.checkIn)} to {formatDate(f.checkOut)}</p>}
          <div className="field">
            <label htmlFor="fld-guests">Number of guests <Req /></label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
              <button type="button" className="step" aria-label="Remove a guest" aria-controls="fld-guests" onClick={() => set('guests', String(Math.max(1, guestsNum - 1)))} disabled={guestsNum <= 1}>−</button>
              <input id="fld-guests" name="guests" type="number" inputMode="numeric" min={1} max={99} step={1} required className="input" style={{ width: 100, textAlign: 'center' }} value={f.guests} onChange={onChange} onBlur={onBlur} aria-invalid={!!errorFor('guests')} aria-describedby={describe('guests', true)} />
              <button type="button" className="step" aria-label="Add a guest" aria-controls="fld-guests" onClick={() => set('guests', String(Math.min(99, guestsNum + 1)))} disabled={guestsNum >= 99}>+</button>
            </div>
            <p id="guests-hint" className="hint">Everyone staying, adults and children. The hotel will confirm what each room can accommodate.</p>
            <Err k="guests" />
          </div>
        </fieldset>

        <fieldset style={{ border: 0, padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 22, minWidth: 0 }}>
          <legend className="eyebrow" style={{ padding: 0, marginBottom: 22 }}>02 · Your details</legend>
          <div className="field">
            <label htmlFor="fld-name">Full name <Req /></label>
            <input id="fld-name" name="name" type="text" autoComplete="name" required className="input" value={f.name} onChange={onChange} onBlur={onBlur} aria-invalid={!!errorFor('name')} aria-describedby={describe('name')} />
            <Err k="name" />
          </div>
          <div className="g-collapse" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 22 }}>
            <div className="field">
              <label htmlFor="fld-email">Email address <Req /></label>
              <input id="fld-email" name="email" type="email" autoComplete="email" inputMode="email" required className="input" value={f.email} onChange={onChange} onBlur={onBlur} aria-invalid={!!errorFor('email')} aria-describedby={describe('email')} />
              <Err k="email" />
            </div>
            <div className="field">
              <label htmlFor="fld-phone">Phone number <Req /></label>
              <input id="fld-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" required className="input" value={f.phone} onChange={onChange} onBlur={onBlur} aria-invalid={!!errorFor('phone')} aria-describedby={describe('phone')} />
              <Err k="phone" />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: 0, padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 22, minWidth: 0 }}>
          <legend className="eyebrow" style={{ padding: 0, marginBottom: 22 }}>03 · Anything else</legend>
          <div className="field">
            <label htmlFor="fld-message">Special requests or message <span style={{ fontWeight: 400, color: '#55544F' }}>(optional)</span></label>
            <textarea id="fld-message" name="message" className="input" rows={5} maxLength={2000} value={f.message} onChange={onChange} onBlur={onBlur} aria-invalid={!!errorFor('message')} aria-describedby={describe('message', true)} />
            <p id="message-hint" className="hint">Arrival time, accessibility needs, questions about the room — anything that helps the hotel reply. {f.message.length > 1800 ? `${2000 - f.message.length} characters left.` : ''}</p>
            <Err k="message" />
          </div>
        </fieldset>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, paddingTop: 28, borderTop: '1px solid #DCD7CD' }}>
          {room && <p className="hint">Inquiring about: <strong style={{ color: '#292A27' }}>{room.name}</strong></p>}
          <p className="hint" style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <InfoIcon />
            <span>This sends an inquiry, not a booking. Your reservation is confirmed only once {settings.hotelName} contacts you. <span className="req" aria-hidden="true">*</span> marks required fields.</span>
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
            <button type="submit" className="btn" disabled={status === 'sending'} aria-busy={status === 'sending'} style={{ minWidth: 280 }}>
              {status === 'sending' ? 'Sending…' : 'Send Reservation Inquiry'} <span className="arr" aria-hidden="true">→</span>
            </button>
            {settings.phoneHref && <p className="hint">Prefer to talk? <a href={settings.phoneHref}>Call {settings.phone}</a></p>}
          </div>
        </div>
      </form>
    </>
  );
}
