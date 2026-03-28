import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Circuits Touristiques & Voyages Organisés : Sahara, Égypte | StayFloow',
  description: "Vivez l'aventure ! Circuits dans le désert algérien (Sahara, Djanet, Taghit) et croisières/excursions en Égypte (Pyramides, Mer Rouge). Un voyage mémorable avec des guides certifiés.",
  keywords: ['circuit sahara algérie', 'voyage organisé égypte', 'excursion taghit djanet', 'croisière nil egypte', 'séjour touristique', 'guide local afrique'],
};

export default function CircuitsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
