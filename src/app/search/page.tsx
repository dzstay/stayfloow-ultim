
import SearchClient from './SearchClient';
import { Metadata } from 'next';
import { getTranslationServer } from '@/lib/i18n-server';

export async function generateMetadata({ searchParams }: { searchParams: Promise<any> }): Promise<Metadata> {
  const t = await getTranslationServer();
  const params = await searchParams;
  const destination = params.dest || '';
  
  return {
    title: destination ? `${destination} | StayFloow` : `Hébergements | StayFloow`,
    description: `Découvrez les meilleurs hébergements à ${destination || 'votre destination'} au meilleur prix sur StayFloow.`,
  };
}

export default async function SearchPage() {
  return <SearchClient />;
}
