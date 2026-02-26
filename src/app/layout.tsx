import type { Metadata, Viewport } from 'next';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase';
import { Toaster } from '@/components/ui/toaster';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { ChatLoader } from '@/components/chat-loader';
import ClientProviders from '@/components/client-providers';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.stayfloow.com'),
  title: {
    default: 'StayFloow.com | Réservez Hébergements, Voitures & Circuits en Afrique',
    template: '%s | StayFloow.com'
  },
  description: 'La plateforme de référence pour réserver hôtels, riads, locations de voitures et excursions en Algérie et partout en Afrique. Meilleurs prix garantis.',
  keywords: ['voyage Afrique', 'réservation hôtel Algérie', 'location voiture Alger', 'circuit Sahara', 'StayFloow', 'tourisme Afrique'],
  authors: [{ name: 'StayFloow Team' }],
  creator: 'StayFloow',
  publisher: 'StayFloow',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
    languages: {
      'fr-FR': '/fr',
      'en-US': '/en',
      'ar-DZ': '/ar',
    },
  },
  openGraph: {
    title: 'StayFloow.com | Votre compagnon de voyage en Afrique',
    description: 'Réservez des séjours uniques, des voitures de location et des circuits authentiques.',
    url: 'https://www.stayfloow.com',
    siteName: 'StayFloow.com',
    images: [
      {
        url: 'https://picsum.photos/seed/stayfloow-og/1200/630',
        width: 1200,
        height: 630,
        alt: 'StayFloow.com - Voyage en Afrique',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StayFloow.com | Voyagez malin en Afrique',
    description: 'Hébergements, voitures et circuits au meilleur prix.',
    images: ['https://picsum.photos/seed/stayfloow-twitter/1200/630'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#14532d',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background min-h-screen flex flex-col">
        <FirebaseClientProvider>
          <ClientProviders>
            <Header />
            <div className="flex-grow">
              {children}
            </div>
            <Footer />
            <ChatLoader />
            <Toaster />
          </ClientProviders>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
