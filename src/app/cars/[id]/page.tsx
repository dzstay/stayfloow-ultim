'use client';

import React, { use } from 'react';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { 
  MapPin, Star, Share2, Heart, ShieldCheck, 
  ChevronLeft, Loader2, Info, Fuel, Gauge, Users, Calendar as CalendarIcon, 
  ArrowRight, Check, CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCurrency } from '@/context/currency-context';
import { useLanguage } from '@/context/language-context';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const db = useFirestore();
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();

  const docRef = doc(db, 'listings', id);
  const { data: car, loading } = useDoc(docRef);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Fallback for mock cars or non-existent DB entries
  const displayData = car || {
    id: id,
    details: {
      name: id === 'mock-car-1' ? 'Dacia Duster 4x4 Sahara' : 'Volkswagen Golf 8 GTI',
      brand: id === 'mock-car-1' ? 'Dacia' : 'Volkswagen',
      description: "Véhicule haut de gamme entretenu avec soin. Parfait pour vos déplacements professionnels ou vos aventures en famille sur StayFloow.com. Inclut toutes les options de sécurité modernes.",
      amenities: ["Climatisation", "Kilométrage illimité", "Assurance tous risques incluse", "Transmission automatique"],
      fuel: id === 'mock-car-1' ? 'Diesel' : 'Essence',
      transmission: id === 'mock-car-1' ? 'Manuelle' : 'Automatique',
      seats: 5
    },
    location: { address: "Alger Centre, Algérie" },
    price: id === 'mock-car-1' ? 7500 : 12000,
    photos: [
      "https://images.unsplash.com/photo-1761320296536-38a4e068b37d?w=1200",
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=1200"
    ],
    rating: 4.8
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
      <div className="bg-white/80 backdrop-blur-md border-b sticky top-16 z-40 py-3 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Button variant="ghost" onClick={() => router.back()} className="font-bold text-slate-600 hover:text-primary">
            <ChevronLeft className="mr-2 h-4 w-4" /> {t('back')}
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" size="icon" className="rounded-full"><Share2 className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" className="rounded-full text-red-500"><Heart className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-primary text-white font-black">STAYFLOOW APPROVED</Badge>
                <div className="flex items-center gap-1.5 bg-amber-50 text-amber-600 px-2 py-1 rounded-lg border border-amber-100">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-black text-sm">{displayData.rating?.toFixed(1) || '4.8'}</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                {displayData.details?.brand} {displayData.details?.model || displayData.details?.name}
              </h1>
              <div className="flex items-center gap-2 text-primary font-bold">
                <MapPin className="h-5 w-5" />
                <span className="text-lg">{displayData.location?.address}</span>
              </div>
            </div>

            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-200 aspect-video relative group border-4 border-white">
              <Carousel className="w-full h-full">
                <CarouselContent>
                  {displayData.photos?.map((photo: string, index: number) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-video w-full">
                        <Image src={photo} alt="Car" fill className="object-cover" priority={index === 0} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-6 bg-white/90 hover:bg-white" />
                <CarouselNext className="right-6 bg-white/90 hover:bg-white" />
              </Carousel>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <SpecBox icon={<Users/>} label="Places" value={`${displayData.details?.seats || 5} Adultes`} />
              <SpecBox icon={<Gauge/>} label="Boîte" value={displayData.details?.transmission || 'Manuelle'} />
              <SpecBox icon={<Fuel/>} label="Énergie" value={displayData.details?.fuel || 'Diesel'} />
              <SpecBox icon={<ShieldCheck/>} label="Assurance" value="Tous Risques" />
            </div>

            <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
              <CardContent className="p-8 md:p-10 space-y-6">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  <Info className="h-6 w-6 text-primary" /> Présentation du véhicule
                </h2>
                <p className="text-slate-600 leading-relaxed text-lg font-medium italic border-l-4 border-primary/20 pl-6">
                  "{displayData.details?.description}"
                </p>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <h2 className="text-2xl font-black text-slate-900">Ce qui est inclus dans le prix</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayData.details?.amenities?.map((opt: string) => (
                  <div key={opt} className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                    <div className="bg-green-100 text-green-600 p-1.5 rounded-full"><Check className="h-4 w-4" /></div>
                    <span className="font-bold text-slate-700 text-sm">{opt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-28 shadow-2xl border-none overflow-hidden rounded-[2.5rem] bg-white">
              <div className="bg-primary p-8 text-white">
                <p className="text-xs font-bold opacity-80 mb-1 uppercase tracking-widest">Prix Location 24h</p>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-4xl font-black">{formatPrice(displayData.price)}</h3>
                  <p className="text-sm font-bold opacity-80">/ jour</p>
                </div>
              </div>

              <CardContent className="p-8 space-y-8">
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vérifier disponibilités</p>
                  <Button variant="outline" className="w-full h-14 justify-start font-bold border-slate-200 rounded-xl">
                    <CalendarIcon className="mr-3 h-5 w-5 text-primary" /> Choisir vos dates
                  </Button>
                </div>

                <Button className="w-full h-16 text-xl font-black bg-primary hover:bg-primary/90 shadow-xl rounded-2xl" asChild>
                  <Link href="/cars/book">Louer ce véhicule <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>

                <div className="pt-6 border-t border-slate-50 space-y-4">
                  <div className="flex items-center gap-3 text-xs font-bold text-green-600">
                    <CheckCircle className="h-4 w-4" /> Annulation gratuite (48h)
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                    <ShieldCheck className="h-4 w-4" /> Certifié Partenaire StayFloow
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
}

function SpecBox({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center gap-1">
      <div className="text-primary mb-1">{icon}</div>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
      <span className="text-sm font-black text-slate-900">{value}</span>
    </div>
  );
}
