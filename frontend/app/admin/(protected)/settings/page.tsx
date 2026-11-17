'use client';

import { useCallback, useEffect, useState } from 'react';
import { ErrorPanel, useToast } from '@/components/admin/ui';
import { ApiError } from '@/lib/api';
import { adminFetch } from '@/lib/admin-api';
import type { SiteSettings } from '@/lib/types';

type Editable = Pick<SiteSettings, 'hotelName' | 'tagline' | 'addressLine1' | 'city' | 'region' | 'postalCode' | 'country' | 'phone' | 'email' | 'mapEmbedUrl' | 'heroAutoplay' | 'heroIntervalSeconds' | 'showTestimonials' | 'footerNote'>;

const TEXT_FIELDS: { name: keyof Editable; label: string; help?: string; wide?: boolean }[] = [
  { name: 'hotelName', label: 'Hotel name' },
  { name: 'tagline', label: 'Header tagline' },
  { name: 'phone', label: 'Phone', help: 'Shown everywhere with a tap-to-call link. Leave blank to hide.' },
  { name: 'email', label: 'Email', help: 'Shown with a mailto link. Leave blank to hide.' },
  { name: 'addressLine1', label: 'Street address', wide: true },
  { name: 'city', label: 'City' },
  { name: 'region', label: 'State' },
  { name: 'postalCode', label: 'ZIP code' },
  { name: 'country', label: 'Country' },
  { name: 'mapEmbedUrl', label: 'Google Maps embed URL (optional)', wide: true, help: 'From Google Maps → Share → Embed a map → copy the src="https://www.google.com/maps/embed?…" value. Leave blank to show the map placeholder (directions links still work).' },
  { name: 'footerNote', label: 'Footer note', wide: true },
];

export default function SettingsAdmin() {
  const [s, setS] = useState<Editable | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [pwErrors, setPwErrors] = useState<Record<string, string>>({});
  const [pwBusy, setPwBusy] = useState(false);
  const toast = useToast();

  const load = useCallback(async () => {
    setLoadError('');
    try {
      const d = await adminFetch<SiteSettings>('/admin/settings');
      setS({ hotelName: d.hotelName, tagline: d.tagline, addressLine1: d.addressLine1, city: d.city, region: d.region, postalCode: d.postalCode, country: d.country, phone: d.phone ?? '', email: d.email ?? '', mapEmbedUrl: d.mapEmbedUrl ?? '', heroAutoplay: d.heroAutoplay, heroIntervalSeconds: d.heroIntervalSeconds, showTestimonials: d.showTestimonials, footerNote: d.footerNote });
    } catch (e) { setLoadError(e instanceof Error ? e.message : 'Could not load settings.'); }
  }, []);
  useEffect(() => { load(); }, [load]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!s) return;
    const fe: Record<string, string> = {};
    if (!s.hotelName.trim()) fe.hotelName = 'Hotel name is required.';
    if (s.heroIntervalSeconds < 5 || s.heroIntervalSeconds > 8) fe.heroIntervalSeconds = 'Use 5–8 seconds between slides.';
    setErrors(fe);
    if (Object.keys(fe).length) return;
    setSaving(true);
    try {
      await adminFetch('/admin/settings', { method: 'PUT', body: JSON.stringify({ ...s, heroIntervalSeconds: Number(s.heroIntervalSeconds) }) });
      toast.show('Settings saved. The website updates immediately.');
    } catch (err) {
      if (err instanceof ApiError) setErrors(err.fieldErrors);
      toast.show(err instanceof Error ? err.message : 'Save failed.', true);
    } finally { setSaving(false); }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    const fe: Record<string, string> = {};
    if (!pw.currentPassword) fe.currentPassword = 'Enter your current password.';
    if (pw.newPassword.length < 10) fe.newPassword = 'Use at least 10 characters.';
    if (pw.confirm !== pw.newPassword) fe.confirm = 'The passwords don’t match.';
    setPwErrors(fe);
    if (Object.keys(fe).length) return;
    setPwBusy(true);
    try {
      await adminFetch('/admin-auth/password', { method: 'PATCH', body: JSON.stringify({ currentPassword: pw.currentPassword, newPassword: pw.newPassword }) });
      setPw({ currentPassword: '', newPassword: '', confirm: '' });
      toast.show('Password changed.');
    } catch (err) {
      if (err instanceof ApiError) setPwErrors(err.fieldErrors);
      toast.show(err instanceof Error ? err.message : 'Could not change the password.', true);
    } finally { setPwBusy(false); }
  }

  if (loadError) return <ErrorPanel message={loadError} onRetry={load} />;
  if (!s) return <div className="skel" style={{ height: 420 }} role="status" aria-label="Loading settings" />;
  const upd = <K extends keyof Editable>(k: K, v: Editable[K]) => setS((p) => (p ? { ...p, [k]: v } : p));

  return (
    <>
      <div className="adm-head"><div><h1 className="adm-h1">Settings</h1><p className="adm-sub">Hotel details, contact information and website features.</p></div></div>
      <form onSubmit={save} noValidate className="adm-card" style={{ display: 'flex', flexDirection: 'column', gap: 22, marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18 }}>
          {TEXT_FIELDS.map((f) => (
            <div key={f.name} className="field" style={f.wide ? { gridColumn: '1 / -1' } : undefined}>
              <label htmlFor={`s-${f.name}`}>{f.label}</label>
              <input id={`s-${f.name}`} className="input" value={(s[f.name] as string | null) ?? ''} onChange={(e) => upd(f.name, e.target.value as never)} aria-invalid={!!errors[f.name]} />
              {f.help && <p className="hint">{f.help}</p>}
              {errors[f.name] && <p className="err">{errors[f.name]}</p>}
            </div>
          ))}
        </div>
        <fieldset style={{ border: '1px solid #DCD7CD', padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <legend style={{ fontWeight: 600, fontSize: 14, padding: '0 6px' }}>Website features</legend>
          <label className="check"><input type="checkbox" checked={s.heroAutoplay} onChange={(e) => upd('heroAutoplay', e.target.checked)} /><span><strong>Homepage slideshow plays automatically</strong><span className="hint" style={{ display: 'block' }}>Always pauses on hover, on the pause button and for visitors who prefer reduced motion.</span></span></label>
          <div className="field" style={{ maxWidth: 260 }}>
            <label htmlFor="s-interval">Seconds between slides (5–8)</label>
            <input id="s-interval" type="number" min={5} max={8} className="input" value={s.heroIntervalSeconds} onChange={(e) => upd('heroIntervalSeconds', Number(e.target.value))} aria-invalid={!!errors.heroIntervalSeconds} />
            {errors.heroIntervalSeconds && <p className="err">{errors.heroIntervalSeconds}</p>}
          </div>
          <label className="check"><input type="checkbox" checked={s.showTestimonials} onChange={(e) => upd('showTestimonials', e.target.checked)} /><span><strong>Show guest testimonials</strong><span className="hint" style={{ display: 'block' }}>Only verified, published testimonials appear — and only when at least one exists.</span></span></label>
        </fieldset>
        <div><button type="submit" className="adm-btn" disabled={saving} aria-busy={saving}>{saving ? 'Saving…' : 'Save settings'}</button></div>
      </form>

      <form onSubmit={changePassword} noValidate className="adm-card" style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 520 }}>
        <h2 className="serif" style={{ margin: 0, fontSize: 26, fontWeight: 500 }}>Change password</h2>
        {([['currentPassword', 'Current password', 'current-password'], ['newPassword', 'New password (10+ characters)', 'new-password'], ['confirm', 'Confirm new password', 'new-password']] as const).map(([k, label, ac]) => (
          <div key={k} className="field">
            <label htmlFor={`pw-${k}`}>{label}</label>
            <input id={`pw-${k}`} type="password" autoComplete={ac} className="input" value={pw[k]} onChange={(e) => setPw((p) => ({ ...p, [k]: e.target.value }))} aria-invalid={!!pwErrors[k]} />
            {pwErrors[k] && <p className="err">{pwErrors[k]}</p>}
          </div>
        ))}
        <div><button type="submit" className="adm-btn" disabled={pwBusy}>{pwBusy ? 'Updating…' : 'Change password'}</button></div>
      </form>
      {toast.node}
    </>
  );
}
