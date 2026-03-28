import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hébergements, Hôtels et Appartements en Algérie & Égypte | StayFloow',
  description: 'Trouvez et réservez les meilleurs hôtels, villas et appartements meublés pour vos vacances en Algérie et en Égypte au meilleur prix garanti. Séjournez en toute sécurité.',
  keywords: ['réservation hôtel algérie', 'appartement meublé alger', 'villa oran location', 'hébergement égypte pas cher', 'riad authentique'],
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
