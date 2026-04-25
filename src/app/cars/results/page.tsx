
import CarsResultsClient from './CarsResultsClient';
import { Metadata } from 'next';
import { getTranslationServer } from '@/lib/i18n-server';

export async function generateMetadata({ searchParams }: { searchParams: Promise<any> }): Promise<Metadata> {
  const t = await getTranslationServer();
  const params = await searchParams;
  const destination = params.dest || '';
  
  return {
    title: destination ? `Location de voiture à ${destination} | StayFloow` : `Résultats Location de Voiture | StayFloow`,
    description: `Trouvez la meilleure voiture de location à ${destination || 'votre destination'} sur StayFloow.com. Comparaison des prix et réservation facile.`,
  };
}

export default async function CarsResultsPage() {
  return <CarsResultsClient />;
}
