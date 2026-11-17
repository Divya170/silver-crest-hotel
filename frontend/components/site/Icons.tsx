type P = { size?: number; className?: string };
const base = (size: number) => ({ width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, 'aria-hidden': true as const });

export const PhoneIcon = ({ size = 18 }: P) => (
  <svg {...base(size)}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg>
);
export const MailIcon = ({ size = 18 }: P) => (
  <svg {...base(size)}><rect x="3" y="5" width="18" height="14" rx="1" /><path d="M3 7l9 6 9-6" /></svg>
);
export const MenuIcon = ({ size = 20 }: P) => (
  <svg {...base(size)}><path d="M3 7h18M3 12h18M3 17h18" /></svg>
);
export const CloseIcon = ({ size = 18 }: P) => (
  <svg {...base(size)}><path d="M5 5l14 14M19 5L5 19" /></svg>
);
export const ChevronLeft = ({ size = 18 }: P) => (
  <svg {...base(size)}><path d="M15 5l-7 7 7 7" /></svg>
);
export const ChevronRight = ({ size = 18 }: P) => (
  <svg {...base(size)}><path d="M9 5l7 7-7 7" /></svg>
);
export const InfoIcon = ({ size = 18 }: P) => (
  <svg {...base(size)} stroke="#6E5A39" style={{ flex: 'none', marginTop: 1 }}><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7.5v.5" /></svg>
);
export const CheckCircle = ({ size = 40 }: P) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true"><circle cx="20" cy="20" r="19" stroke="#B39A70" /><path d="M12 20.5l5.5 5.5L28 15" stroke="#292A27" strokeWidth="1.6" /></svg>
);
export const PlayIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4l13 8-13 8z" /></svg>
);
export const PauseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
);
export const CrestMark = ({ size = 34 }: P) => (
  <svg width={size} height={size} viewBox="0 0 34 34" fill="none" aria-hidden="true"><path d="M3 24 L12 12 L17 18 L22 9 L31 24" stroke="#B39A70" strokeWidth="1.4" strokeLinejoin="round" /><path d="M3 28 H31" stroke="currentColor" strokeWidth="1.4" /></svg>
);
export const PinIcon = () => (
  <svg width="34" height="44" viewBox="0 0 34 44" aria-hidden="true"><path d="M17 43s15-15.5 15-26A15 15 0 0 0 2 17c0 10.5 15 26 15 26z" fill="#292A27" /><circle cx="17" cy="17" r="5.5" fill="#B39A70" /></svg>
);

/** Line icons for amenities (names match the backend's AMENITY_ICONS). */
const AMENITY_PATHS: Record<string, string> = {
  bed: 'M3 18v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7M3 14h18M7 9V6h4v3',
  wifi: 'M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M12 19.5v.01',
  parking: 'M6 21V3h7a5 5 0 0 1 0 10H6',
  coffee: 'M4 8h13v5a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6zM17 10h2a2 2 0 0 1 0 4h-2M8 3v2M12 3v2',
  dining: 'M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 3c-2 0-3 3-3 6s1 4 3 4v8',
  pool: 'M2 18c2 0 2-1.5 4-1.5S8 18 10 18s2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5M8 15V5a2 2 0 0 1 4 0M16 15V5a2 2 0 0 0-4 0M8 9h8',
  fitness: 'M6 7v10M18 7v10M3 10v4M21 10v4M6 12h12',
  desk: 'M3 8h18M5 8v12M19 8v12M8 4h8v4H8z',
  laundry: 'M5 3h14v18H5zM5 7h14M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  concierge: 'M4 17h16M6 17a6 6 0 0 1 12 0M12 9V7M10 7h4',
  accessible: 'M12 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM12 7v6h5l2 5M12 9H7M9 13a5 5 0 1 0 5 6',
  shower: 'M4 20V8a5 5 0 0 1 10 0M10 8h8M12 12v1M15 12v1M18 12v1M12 16v1M15 16v1M18 16v1',
  tv: 'M3 6h18v11H3zM8 21h8M12 17v4',
  air: 'M3 8h12a3 3 0 1 0-3-3M3 12h16a3 3 0 1 1-3 3M3 16h8',
  key: 'M14 10a4 4 0 1 0-3.5 4L10 21h3v-2h2v-2h2l-1.5-3.5',
  star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z',
};

export function AmenityIcon({ name, size = 22 }: { name?: string | null; size?: number }) {
  const d = (name && AMENITY_PATHS[name]) || AMENITY_PATHS.star;
  return (
    <svg {...base(size)}><path d={d} /></svg>
  );
}
