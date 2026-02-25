
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Filter, Star, MapPin, ChevronDown, Heart, LayoutGrid, List, 
  Wifi, ShieldCheck, Car, Coffee, Waves, ParkingCircle, Info, ChevronRight, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import AdvancedSearchBar from '@/components/search/AdvancedSearchBar';

export default function SearchPage() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const mockResults = [
    {
      id: 1,
      name: 'Riad Dar El Kenz',
      location: 'Casbah, Alger',
      rating: 9.4,
      ratingText: 'Exceptionnel',
      reviews: 458,
      price: '12 500',
      type: 'Riad authentique',
      image: 'https://picsum.photos/seed/riad1/600/400',
      badge: 'Coup de cœur',
      amenities: ['Wifi gratuit', 'Petit-déjeuner inclus', 'Climatisation'],
      options: ['Navette aéroport', 'Guide local']
    },
    {
      id: 2,
      name: 'Nile Palace Cairo',
      location: 'Zamalek, Le Caire',
      rating: 9.1,
      ratingText: 'Superbe',
      reviews: 1840,
      price: '18 900',
      type: 'Hôtel 5 étoiles',
      image: 'https://picsum.photos/seed/hotel1/600/400',
      badge: 'Luxe',
      amenities: ['Piscine', 'Spa', 'Vue sur le Nil'],
      options: ['Dîner croisière', 'Parking sécurisé']
    },
    {
      id: 3,
      name: 'Villa Sahara Dream',
      location: 'Ghardaïa, Algérie',
      rating: 8.8,
      ratingText: 'Fabuleux',
      reviews: 124,
      price: '15 000',
      type: 'Villa Privée',
      image: 'https://picsum.photos/seed/villa1/600/400',
      badge: 'Populaire',
      amenities: ['Piscine privée', 'Jardin', 'Parking'],
      options: ['Cuisinier privé']
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header Search Area */}
      <div className="bg-primary pt-6 pb-12 px-6 shadow-xl">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-3xl font-bold text-white tracking-tighter">StayFloow</Link>
            <div className="flex gap-4">
               <Button variant="ghost" className="text-white">DZD / Français</Button>
               <Button variant="outline" className="text-white border-white hover:bg-white/10">Se connecter</Button>
            </div>
          </div>
          <AdvancedSearchBar />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters - Inspired by Booking.com 7th photo */}
        <aside className="w-full lg:w-72 shrink-0 space-y-8">
          <div className="p-6 bg-white rounded-xl border-2 border-primary/10 shadow-sm sticky top-24">
            <h3 className="font-bold text-xl mb-6 flex items-center gap-2 text-primary">
              <Filter className="h-5 w-5" /> Filtres
            </h3>
            
            <div className="space-y-8">
              {/* Budget */}
              <div>
                <h4 className="text-sm font-bold mb-4 uppercase tracking-wider text-muted-foreground">Votre budget / nuit</h4>
                <div className="space-y-4">
                  <Slider defaultValue={[50]} max={100} step={1} className="text-primary" />
                  <div className="flex justify-between text-xs font-bold">
                    <span>0 DZD</span>
                    <span>30 000+ DZD</span>
                  </div>
                  <div className="space-y-3 mt-4">
                    {['0 - 5 000', '5 000 - 10 000', '10 000 - 20 000', '20 000 +'].map(range => (
                      <FilterItem key={range} label={`${range} DZD`} count={Math.floor(Math.random() * 50)} />
                    ))}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Populaire */}
              <div>
                <h4 className="text-sm font-bold mb-4 uppercase tracking-wider text-muted-foreground">Filtres populaires</h4>
                <div className="space-y-3">
                  <FilterItem label="Petit-déjeuner inclus" />
                  <FilterItem label="Annulation gratuite" />
                  <FilterItem label="Piscine" />
                  <FilterItem label="Hôtels" />
                  <FilterItem label="Riads" />
                </div>
              </div>

              <Separator />

              {/* Étoiles */}
              <div>
                <h4 className="text-sm font-bold mb-4 uppercase tracking-wider text-muted-foreground">Note de l'établissement</h4>
                <div className="space-y-3">
                  {[5, 4, 3, 2].map(s => (
                    <div key={s} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox id={`star-${s}`} />
                        <label htmlFor={`star-${s}`} className="text-sm font-medium flex items-center gap-1">
                          {s} étoiles <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        </label>
                      </div>
                      <span className="text-xs text-muted-foreground">{Math.floor(Math.random() * 20)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Équipements (Générés par les partenaires) */}
              <div>
                <h4 className="text-sm font-bold mb-4 uppercase tracking-wider text-muted-foreground">Équipements</h4>
                <div className="space-y-3">
                  <FilterItem label="Wifi gratuit" icon={<Wifi className="h-3 w-3" />} />
                  <FilterItem label="Navette aéroport" icon={<Car className="h-3 w-3" />} />
                  <FilterItem label="Parking" icon={<ParkingCircle className="h-3 w-3" />} />
                  <FilterItem label="Climatisation" />
                  <FilterItem label="Spa / Bien-être" icon={<Waves className="h-3 w-3" />} />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Results Area */}
        <main className="flex-grow space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-muted">
            <div>
               <h2 className="text-2xl font-bold text-primary">{destination || 'Algérie'} : {mockResults.length} établissements trouvés</h2>
               <p className="text-sm text-muted-foreground">Les prix affichés incluent les taxes et frais.</p>
            </div>
            <div className="flex items-center gap-2 bg-muted p-1 rounded-lg shrink-0">
               <Button 
                variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
                size="sm" 
                className="gap-2 font-bold"
                onClick={() => setViewMode('list')}
               >
                 <List className="h-4 w-4" /> Liste
               </Button>
               <Button 
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
                size="sm" 
                className="gap-2 font-bold"
                onClick={() => setViewMode('grid')}
               >
                 <LayoutGrid className="h-4 w-4" /> Mosaïque
               </Button>
            </div>
          </div>

          <div className={cn(
            "grid gap-6",
            viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
          )}>
            {mockResults.map((item) => (
              <ResultCard key={item.id} item={item} mode={viewMode} />
            ))}
          </div>
          
          <div className="bg-primary/5 rounded-2xl p-8 border-2 border-dashed border-primary/20 flex flex-col md:flex-row items-center gap-6">
            <div className="bg-primary text-white p-4 rounded-full">
               <ShieldCheck className="h-8 w-8" />
            </div>
            <div className="flex-grow">
              <h4 className="font-bold text-xl text-primary mb-1">StayFloow Guarantee</h4>
              <p className="text-muted-foreground">Nous égalisons les prix. Si vous trouvez moins cher ailleurs, nous vous remboursons la différence.</p>
            </div>
            <Button variant="outline" className="border-primary text-primary font-bold">En savoir plus</Button>
          </div>
        </main>
      </div>
    </div>
  );
}

function FilterItem({ label, count, icon }: { label: string, count?: number, icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between group cursor-pointer">
      <div className="flex items-center space-x-2">
        <Checkbox id={label} />
        <label htmlFor={label} className="text-sm font-medium leading-none flex items-center gap-2 group-hover:text-primary transition-colors">
          {icon} {label}
        </label>
      </div>
      {count !== undefined && <span className="text-xs text-muted-foreground">{count}</span>}
    </div>
  );
}

function ResultCard({ item, mode }: { item: any, mode: 'list' | 'grid' }) {
  return (
    <Card className={cn(
      "overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all duration-300 shadow-lg group",
      mode === 'list' ? "flex flex-col md:flex-row" : "flex flex-col"
    )}>
      <div className={cn(
        "relative shrink-0",
        mode === 'list' ? "w-full md:w-80 h-64 md:h-auto" : "w-full h-56"
      )}>
        <Image src={item.image} alt={item.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full text-primary shadow-md"
        >
          <Heart className="h-5 w-5" />
        </Button>
        {item.badge && (
          <Badge className="absolute top-4 left-4 bg-secondary text-primary font-bold px-3 py-1 shadow-md border-none">
            {item.badge}
          </Badge>
        )}
      </div>
      
      <div className="flex-grow p-6 flex flex-col justify-between bg-white">
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-2xl font-bold text-primary group-hover:underline cursor-pointer tracking-tight">{item.name}</h3>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />)}
                </div>
              </div>
              <div className="flex items-center text-sm text-primary font-medium hover:underline cursor-pointer mb-2">
                <MapPin className="h-4 w-4 mr-1" /> {item.location}
              </div>
            </div>
            <div className="flex items-center gap-3">
               <div className="text-right">
                  <div className="font-bold text-primary text-lg leading-tight">{item.ratingText}</div>
                  <div className="text-xs text-muted-foreground">{item.reviews} expériences</div>
               </div>
               <div className="bg-primary text-white font-bold h-12 w-12 rounded-lg flex items-center justify-center text-xl shadow-lg shadow-primary/20">
                  {item.rating}
               </div>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground mb-4 font-medium italic border-l-4 border-secondary pl-3">
            {item.type}
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {item.amenities.map((a: string) => (
              <Badge key={a} variant="outline" className="text-[10px] bg-primary/5 border-primary/10 text-primary font-bold">
                <Check className="h-2 w-2 mr-1" /> {a}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-end border-t pt-6 mt-auto">
          <div className="space-y-1">
             <div className="text-xs font-bold text-green-600 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> Annulation gratuite
             </div>
             <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Info className="h-3 w-3" /> Aucun prépaiement requis
             </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground mb-1">Dès</div>
            <div className="text-3xl font-black text-primary tracking-tight">{item.price} DZD</div>
            <p className="text-[10px] text-muted-foreground mb-4 italic">+ taxes et frais inclus</p>
            <Button className="bg-primary hover:bg-primary/90 rounded-xl px-8 font-black group/btn shadow-lg shadow-primary/20">
              Voir l'offre <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
