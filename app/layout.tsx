import type { Metadata } from 'next';
import { Inter, Anek_Malayalam } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/layout/Navigation';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const anekMalayalam = Anek_Malayalam({
  subsets: ['malayalam'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-malayalam'
});

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
      <body suppressHydrationWarning className={`${inter.variable} ${anekMalayalam.variable} font-sans min-h-screen flex`}>
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
