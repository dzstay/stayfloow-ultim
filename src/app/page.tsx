
import Link from 'next/link';
import Image from 'next/image';
import { Search, MapPin, Calendar, Users, Building, Car, Compass, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import AdvancedSearchBar from '@/components/search/AdvancedSearchBar';

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-home');
  const categories = [
    { id: 'accommodations', name: 'Séjours', icon: Building, description: 'Hôtels, Riads, Villas', image: PlaceHolderImages[1] },
    { id: 'cars', name: 'Location de voitures', icon: Car, description: 'SUV, Berlines, 4x4', image: PlaceHolderImages[3] },
    { id: 'circuits', name: 'Circuits', icon: Compass, description: 'Excursions désert, Croisières', image: PlaceHolderImages[2] },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-primary text-white py-4 px-6 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            StayFloow<span className="text-secondary">.com</span>
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/search?type=accommodations" className="hover:text-secondary transition-colors font-medium">Séjours</Link>
            <Link href="/search?type=cars" className="hover:text-secondary transition-colors font-medium">Voitures</Link>
            <Link href="/search?type=circuits" className="hover:text-secondary transition-colors font-medium">Circuits</Link>
            <Button variant="outline" className="text-primary bg-white hover:bg-white/90 border-none font-bold" asChild>
              <Link href="/partners/join">Devenir partenaire</Link>
            </Button>
            <Button variant="ghost" className="text-white hover:bg-white/10">Se connecter</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <Image 
          src={heroImage?.imageUrl || ''} 
          alt={heroImage?.description || ''} 
          fill 
          className="object-cover"
          priority
          data-ai-hint={heroImage?.imageHint}
        />
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative z-10 w-full max-w-5xl px-6 text-center md:text-left">
          <div className="mb-10">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              Trouvez votre prochain séjour en Afrique
            </h1>
            <p className="text-xl text-white/90 drop-shadow-md">
              Des offres incroyables sur les hôtels, riads et bien plus encore...
            </p>
          </div>

          <div className="max-w-4xl mx-auto md:mx-0">
            <AdvancedSearchBar />
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-16 flex-grow w-full">
        {/* Categories Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-primary">Explorer par catégorie</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/search?type=${cat.id}`}>
                <CardWrapper>
                  <div className="relative h-56">
                    <Image 
                      src={cat.image.imageUrl} 
                      alt={cat.name} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      data-ai-hint={cat.image.imageHint}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                       <cat.icon className="h-6 w-6 mb-2" />
                       <h3 className="font-bold text-xl">{cat.name}</h3>
                    </div>
                  </div>
                  <div className="p-4 bg-white">
                    <p className="text-muted-foreground text-sm flex justify-between items-center">
                      {cat.description}
                      <ChevronRight className="h-4 w-4 text-primary" />
                    </p>
                  </div>
                </CardWrapper>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Destinations */}
        <section className="mb-20">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-primary">Destinations prisées</h2>
              <p className="text-muted-foreground">Les choix favoris des voyageurs en Algérie et Égypte</p>
            </div>
            <Button variant="link" className="text-primary font-bold">Voir tout</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { city: 'Alger', country: 'Algérie', count: '1,240', image: 'https://picsum.photos/seed/algiers/400/500' },
              { city: 'Le Caire', country: 'Égypte', count: '3,510', image: 'https://picsum.photos/seed/cairo/400/500' },
              { city: 'Oran', country: 'Algérie', count: '850', image: 'https://picsum.photos/seed/oran/400/500' },
              { city: 'Louxor', country: 'Égypte', count: '920', image: 'https://picsum.photos/seed/luxor/400/500' },
            ].map((dest, i) => (
              <div key={i} className="relative rounded-xl overflow-hidden group cursor-pointer h-80 shadow-lg">
                <Image src={dest.image} alt={dest.city} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold">{dest.city}</h3>
                  <p className="text-sm opacity-90">{dest.country}</p>
                  <p className="text-xs mt-2 bg-secondary/90 text-primary px-2 py-1 rounded-md inline-block font-bold">
                    {dest.count} établissements
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1">
            <Link href="/" className="text-3xl font-bold mb-6 block">
              StayFloow<span className="text-secondary">.com</span>
            </Link>
            <p className="text-sm text-white/70 leading-relaxed">
              Votre porte d'entrée vers l'hospitalité et l'aventure africaine authentique. Réservez en toute confiance.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6 border-b border-white/20 pb-2">Support</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li>Service Client</li>
              <li>Aide aux partenaires</li>
              <li>Politique de confidentialité</li>
              <li>Conditions générales</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6 border-b border-white/20 pb-2">Découvrir</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li>Application mobile</li>
              <li>Programme de fidélité</li>
              <li>Guides de voyage</li>
              <li>Location de voitures</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6 border-b border-white/20 pb-2">Partenaires</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li>Espace Extranet</li>
              <li>Devenir partenaire</li>
              <li>Programme Affilié</li>
              <li>Promouvoir une annonce</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 text-center text-xs text-white/50">
          © 2025 StayFloow.com. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}

function CardWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl hover:shadow-2xl transition-all duration-300 border border-muted group cursor-pointer shadow-md">
      {children}
    </div>
  );
}
