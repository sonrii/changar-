import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import '@/styles/miniapp.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import { MiniKitProvider } from '@worldcoin/minikit-js/minikit-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ChangAR - Laburo rápido, gente real',
  description: 'Conectamos trabajadores con clientes en Argentina. Encontrá profesionales para tu proyecto o conseguí nuevos trabajos.',
  keywords: 'trabajadores, oficios, servicios, argentina, changas, trabajo, profesionales',
  authors: [{ name: 'ChangAR' }],
  creator: 'ChangAR',
  publisher: 'ChangAR',
  applicationName: 'ChangAR',
  manifest: '/manifest.json',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: 'cover',
  },
  themeColor: '#2563eb',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ChangAR',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://changar.app',
    siteName: 'ChangAR',
    title: 'ChangAR - Laburo rápido, gente real',
    description: 'Conectamos trabajadores con clientes en Argentina',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-AR">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={inter.className}>
        <MiniKitProvider>
          <AuthProvider>
            <Toaster position="top-center" />
            {children}
          </AuthProvider>
        </MiniKitProvider>
      </body>
    </html>
  );
}
