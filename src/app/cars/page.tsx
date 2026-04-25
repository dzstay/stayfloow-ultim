
import CarsClient from './CarsClient';
import { Metadata } from 'next';
import { getTranslationServer } from '@/lib/i18n-server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslationServer();
  return {
    title: `${t('car_rental')} | StayFloow`,
    description: "Louez une voiture au meilleur prix en Algérie. Large choix de véhicules économiques, SUV, berlines et luxe.",
  };
}

export default async function CarsPage() {
  return <CarsClient />;
}
