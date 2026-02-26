import Link from 'next/link';
import Image from 'next/image';
import { Building, Car, Compass, Star, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdvancedSearchBar from '@/components/search/AdvancedSearchBar';
import { AiRecommender } from '@/components/ai-recommender';
import { PersonalizedRecommendations } from '@/components/personalized-recommendations';

export default function Home() {
  const propertyTypes = [
    { name: 'Hôtels', image: 'https://picsum.photos/seed/hotel/400/300', count: '820,412' },
    { name: 'Appartements', image: 'https://picsum.photos/seed/apt/400/300', count: '915,234' },
    { name: 'Complexes hôteliers', image: 'https://picsum.photos/seed/resort/400/300', count: '145,098' },
    { name: 'Villas', image: 'https://picsum.photos/seed/villa/400/300', count: '450,123' },
  ];

  const uniqueStays = [
    { id: 'prop-1', name: 'Riad Dar Al-Andalus', location: 'Fès, Maroc', rating: 9.8, price: '120 €', image: 'https://picsum.photos/seed/unique1/400/500' },
    { id: 'prop-2', name: 'Desert Cave Hotel', location: 'Ghardaïa, Algérie', rating: 9.5, price: '85 €', image: 'https://picsum.photos/seed/unique2/400/500' },
    { id: 'prop-3', name: 'Nile Floating Palace', location: 'Louxor, Égypte', rating: 9.6, price: '150 €', image: 'https://picsum.photos/seed/unique3/400/500' },
    { id: 'prop-4', name: 'Royal Algerian Tent', location: 'Timimoun, Algérie', rating: 9.7, price: '110 €', image: 'https://picsum.photos/seed/unique4/400/500' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f5]">
      {/* Header handled by RootLayout */}

      {/* Hero Section */}
      <section className="bg-primary pt-12 pb-24 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10 text-center md:text-left">
          <h1 className="text-5xl font-black text-white mb-4 leading-tight tracking-tighter">
            Trouvez votre prochain séjour sur StayFloow<span className="text-secondary">.com</span>
          </h1>
          <p className="text-2xl text-white opacity-90 mb-12 font-medium">
            Des offres incroyables sur les hôtels, riads et bien plus encore en Afrique...
          </p>
          <AdvancedSearchBar />
        </div>
        {/* Decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -mr-20 -mt-20" />
      </section>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 -mt-10 pb-20 w-full z-20">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* AI Recommender - Section Vedette */}
          <div className="lg:col-span-2">
            <AiRecommender />
          </div>

          {/* Promotion Banner */}
          <div className="lg:col-span-1">
            <section className="h-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200 p-8 flex flex-col justify-between group">
              <div>
                <span className="text-xs font-black text-primary bg-primary/10 px-3 py-1 rounded-full mb-4 inline-block uppercase tracking-widest">Offres 2026</span>
                <h2 className="text-3xl font-black mb-4 group-hover:text-primary transition-colors">-15 % minimum</h2>
                <p className="text-slate-500 font-medium leading-relaxed mb-6">Réservez dès maintenant votre aventure africaine sur StayFloow.com et profitez de réductions exceptionnelles.</p>
              </div>
              <div className="space-y-6">
                <div className="w-full h-48 relative rounded-2xl overflow-hidden shadow-lg">
                  <Image src="https://picsum.photos/seed/promo/600/400" alt="Promotion" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 text-white h-14 text-lg font-black rounded-xl shadow-lg shadow-primary/20">
                  Découvrir les offres
                </Button>
              </div>
            </section>
          </div>
        </div>

        {/* Property Types */}
        <section className="mb-20">
          <h2 className="text-3xl font-black mb-8 text-slate-900 tracking-tight">Rechercher par type d'hébergement</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {propertyTypes.map((type) => (
              <Link key={type.name} href={`/search?type=${type.name.toLowerCase()}`} className="group">
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden mb-4 shadow-xl border-4 border-white transition-all group-hover:shadow-2xl group-hover:-translate-y-1">
                  <Image src={type.image} alt={type.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <h3 className="font-black text-xl group-hover:text-primary transition-colors text-slate-900">{type.name}</h3>
                <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">{type.count} établissements</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Unique Stays */}
        <section className="mb-20">
          <div className="mb-10">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Séjournez dans nos hébergements uniques</h2>
            <p className="text-slate-500 font-medium text-lg mt-2">Une sélection rigoureuse des établissements les mieux notés sur StayFloow.com</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {uniqueStays.map((stay, i) => (
              <Link key={i} href={`/properties/${stay.id}`} className="group cursor-pointer">
                <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-5 shadow-2xl border-4 border-white transition-all group-hover:shadow-primary/20 group-hover:-translate-y-2">
                  <Image src={stay.image} alt={stay.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-xl">
                    <div className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                      <span className="text-sm font-black text-slate-900">{stay.rating}</span>
                    </div>
                  </div>
                </div>
                <h3 className="font-black text-xl text-slate-900 truncate group-hover:text-primary transition-colors mb-1">{stay.name}</h3>
                <p className="text-sm text-slate-500 mb-4 font-bold flex items-center gap-1"><Star className="h-3 w-3 text-primary" /> {stay.location}</p>
                <div className="flex justify-between items-end">
                  <span className="text-xs font-black text-primary bg-primary/5 px-3 py-1 rounded-full uppercase tracking-widest">ÉLITE</span>
                  <div className="text-right">
                    <span className="text-[10px] font-black text-slate-400 uppercase block">À partir de </span>
                    <span className="font-black text-2xl text-slate-900 tracking-tighter">{stay.price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Personalized Recommendations */}
        <PersonalizedRecommendations />

      </main>
    </div>
  );
}
