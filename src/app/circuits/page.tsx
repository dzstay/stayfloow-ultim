
import CircuitsClient from './CircuitsClient';
import { Metadata } from 'next';
import { getTranslationServer } from '@/lib/i18n-server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslationServer();
  return {
    title: `${t('tours')} | StayFloow`,
    description: "Découvrez les meilleurs circuits touristiques et activités en Algérie et Égypte au meilleur prix.",
  };
}

export default async function CircuitsPage() {
  return <CircuitsClient />;
}
