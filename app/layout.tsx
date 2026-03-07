import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/layout/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Vijnana Poshini Grandhasala',
  description: 'Digital management system for Mulavoor Vijnana Poshini Library',
  manifest: '/manifest.json',
};

export const viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex`}>
        <Navigation />
        <main className="flex-1 flex flex-col min-h-screen min-w-0">
          <div className="flex-1 w-full min-w-0">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
