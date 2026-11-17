/** Client-side mirror of the NestJS inquiry rules (backend/src/inquiries/inquiries.service.ts) for instant feedback. */
export interface InquiryForm {
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}

export const FIELD_ORDER: (keyof InquiryForm)[] = ['checkIn', 'checkOut', 'guests', 'name', 'email', 'phone', 'message'];

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function localToday() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function nextDay(iso: string) {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + 1);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function nightsBetween(a: string, b: string) {
  return Math.round((new Date(`${b}T12:00:00`).getTime() - new Date(`${a}T12:00:00`).getTime()) / 86_400_000);
}

export function validateInquiry(f: InquiryForm): Partial<Record<keyof InquiryForm, string>> {
  const e: Partial<Record<keyof InquiryForm, string>> = {};
  const today = localToday();
  if (!f.checkIn) e.checkIn = 'Choose a check-in date.';
  else if (f.checkIn < today) e.checkIn = 'Check-in can’t be in the past.';
  if (!f.checkOut) e.checkOut = 'Choose a check-out date.';
  else if (f.checkIn && f.checkOut <= f.checkIn) e.checkOut = 'Check-out must be later than check-in.';
  const g = Number(f.guests);
  if (String(f.guests).trim() === '' || !Number.isInteger(g) || g < 1) e.guests = 'Enter a whole number of guests, 1 or more.';
  else if (g > 99) e.guests = 'For groups larger than 99, please contact the hotel directly.';
  if (!f.name.trim()) e.name = 'Please enter your full name.';
  if (!f.email.trim()) e.email = 'Please enter your email address.';
  else if (!EMAIL_RE.test(f.email.trim())) e.email = 'Enter an email address like name@example.com.';
  if (!f.phone.trim()) e.phone = 'Please enter a phone number.';
  else if (f.phone.replace(/\D/g, '').length < 7) e.phone = 'Enter a phone number with at least 7 digits.';
  if (f.message.length > 2000) e.message = 'Please keep your message under 2,000 characters.';
  return e;
}

export function formatDate(iso: string) {
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}
