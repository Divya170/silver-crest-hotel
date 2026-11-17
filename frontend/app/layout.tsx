import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';

const serif = Cormorant_Garamond({ subsets: ['latin'], weight: ['400', '500', '600'], style: ['normal', 'italic'], variable: '--font-serif', display: 'swap' });
const sans = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-sans', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'Silver Crest Hotel · Bakersfield, California', template: '%s · Silver Crest Hotel' },
  description: 'Silver Crest Hotel in Bakersfield, California. Explore rooms, amenities and the gallery, and send a reservation inquiry.',
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#F8F6F0' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
