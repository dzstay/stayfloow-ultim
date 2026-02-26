import type { Metadata } from 'next';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/context/language-context';
import { CurrencyProvider } from '@/context/currency-context';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { CustomerSupportChat } from '@/components/customer-support-chat';

export const metadata: Metadata = {
  title: 'StayFloow.com | Réservez Hébergements, Voitures & Circuits en Afrique',
  description: 'La plateforme de référence pour réserver hôtels, riads, locations de voitures et excursions en Afrique.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background min-h-screen flex flex-col">
        <FirebaseClientProvider>
          <LanguageProvider>
            <CurrencyProvider>
              <Header />
              <div className="flex-grow">
                {children}
              </div>
              <Footer />
              <CustomerSupportChat />
              <Toaster />
            </CurrencyProvider>
          </LanguageProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
