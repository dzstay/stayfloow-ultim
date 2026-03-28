import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Location de Voitures Pas Cher (Algérie & Égypte) - Sans Caution | StayFloow',
  description: "Louez une voiture en Algérie et en Égypte : aéroport d'Alger, Oran, Le Caire. Large choix de véhicules avec kilométrage illimité et annulation gratuite.",
  keywords: ['location voiture algérie', 'véhicule sans caution alger', 'location aéroport eypte', 'louer voiture pas cher'],
};

export default function CarsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
