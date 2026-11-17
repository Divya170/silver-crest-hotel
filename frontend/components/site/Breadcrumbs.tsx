import Link from 'next/link';

export function Breadcrumbs({ current, light }: { current: string; light?: boolean }) {
  const linkColor = light ? '#55544F' : undefined;
  return (
    <nav aria-label="Breadcrumb">
      <ol className="crumbs" style={light ? { color: '#55544F' } : undefined}>
        <li><Link href="/" style={linkColor ? { color: linkColor } : undefined}>Home</Link></li>
        <li aria-hidden="true">/</li>
        <li aria-current="page" style={{ color: light ? '#6E5A39' : '#DCC9A3' }}>{current}</li>
      </ol>
    </nav>
  );
}
