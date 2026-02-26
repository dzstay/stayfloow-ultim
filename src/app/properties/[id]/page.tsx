'use client';

import React, { use } from 'react';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { 
  MapPin, Star, Share2, Heart, ShieldCheck, 
  Wifi, Coffee, Car, Wind, ChevronLeft, 
  ChevronRight, Calendar as CalendarIcon, Loader2,
  CheckCircle,
  Info,
  Utensils,
  Clock,
  Dog,
  Gamepad2,
  Layout,
  Plug,
  Bath,
  Baby,
  ArrowUpCircle,
  Accessibility
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

export default function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const db = useFirestore();
  const { t } = useLanguage();
  const docRef = doc(db, 'listings', id);
  const { data: property, loading } = useDoc(docRef);
  const { formatPrice } = useCurrency();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-slate-400 font-bold animate-pulse">{t('loading_property') || "Chargement de l'établissement..."}</p>
        </div>
      </div>
    );
  }

  const displayData = property || {
    id: 'default',
    details: {
      name: "Riad Dar Al-Andalus",
      description: "Niché au cœur de la médina, ce riad historique offre une expérience immersive unique. Entièrement restauré par des artisans locaux, il allie confort moderne et architecture traditionnelle fassie. Profitez de notre patio arboré et de notre terrasse panoramique surplombant les toits de la ville.",
      amenities: ["WiFi gratuit", "Petit-déjeuner inclus", "Climatisation", "Parking gratuit"],
    },
    location: { address: "Derb el-Miter, Fès, Maroc", lat: 34.06, lng: -5.00 },
    price: 12500,
    photos: [
      "https://picsum.photos/seed/riad-detail-1/1200/800",
      "https://picsum.photos/seed/riad-detail-2/1200/800",
      "https://picsum.photos/seed/riad-detail-3/1200/800",
      "https://picsum.photos/seed/riad-detail-4/1200/800"
    ]
  };

  const propertyId = property?.id || id;

  const getAmenityIcon = (amenity: string) => {
    const a = amenity.toLowerCase();
    if (a.includes('wifi')) return <Wifi className="h-5 w-5" />;
    if (a.includes('petit-déjeuner') || a.includes('breakfast')) return <Utensils className="h-5 w-5" />;
    if (a.includes('clim')) return <Wind className="h-5 w-5" />;
    if (a.includes('parking')) return <Car className="h-5 w-5" />;
    if (a.includes('piscine') || a.includes('pool')) return <Gamepad2 className="h-5 w-5" />;
    if (a.includes('restaurant')) return <Utensils className="h-5 w-5" />;
    if (a.includes('réception')) return <Clock className="h-5 w-5" />;
    if (a.includes('animaux') || a.includes('pets')) return <Dog className="h-5 w-5" />;
    if (a.includes('terrasse') || a.includes('vue')) return <Layout className="h-5 w-5" />;
    if (a.includes('cuisine')) return <Layout className="h-5 w-5" />;
    if (a.includes('prise')) return <Plug className="h-5 w-5" />;
    if (a.includes('salle de bain')) return <Bath className="h-5 w-5" />;
    if (a.includes('bébé')) return <Baby className="h-5 w-5" />;
    if (a.includes('ascenseur')) return <ArrowUpCircle className="h-5 w-5" />;
    if (a.includes('pmr')) return <Accessibility className="h-5 w-5" />;
    return <ShieldCheck className="h-5 w-5" />;
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
      <div className="bg-white/80 backdrop-blur-md border-b sticky top-16 z-40 py-3 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Button variant="ghost" onClick={() => router.back()} className="font-bold text-slate-600 hover:text-primary transition-colors">
            <ChevronLeft className="mr-2 h-4 w-4" /> {t('back')}
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" size="icon" className="rounded-full border-slate-200 hover:bg-slate-50"><Share2 className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" className="rounded-full border-slate-200 hover:bg-slate-50"><Heart className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-black uppercase">STAYFLOOW SELECTION</Badge>
                <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">Note : 9.8</Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                {displayData.details?.name}
              </h1>
              <div className="flex items-center gap-1 text-primary font-bold hover:underline cursor-pointer transition-all">
                <MapPin className="h-5 w-5" />
                <span className="text-lg">{displayData.location?.address}</span>
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden shadow-2xl bg-slate-200 aspect-video relative group border-4 border-white">
              <Carousel className="w-full h-full">
                <CarouselContent>
                  {displayData.photos?.map((photo: string, index: number) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-video w-full">
                        <Image src={photo} alt="Property" fill className="object-cover" priority={index === 0} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-6 bg-white/90 hover:bg-white border-none shadow-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <CarouselNext className="right-6 bg-white/90 hover:bg-white border-none shadow-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </Carousel>
            </div>

            <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
              <CardContent className="p-8 md:p-10 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Info className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900">{t('presentation')}</h2>
                </div>
                <p className="text-slate-600 leading-relaxed text-lg font-medium italic">
                  "{displayData.details?.description}"
                </p>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <Star className="h-6 w-6 text-primary" /> {t('amenities_label')}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {displayData.details?.amenities?.map((amenity: string) => {
                  const isBreakfast = amenity.toLowerCase().includes('petit-déjeuner') || amenity.toLowerCase().includes('breakfast');
                  return (
                    <div 
                      key={amenity} 
                      className={cn(
                        "flex items-center gap-3 p-5 rounded-2xl border transition-all group",
                        isBreakfast 
                          ? "bg-green-50 border-green-200 shadow-md scale-105" 
                          : "bg-white border-slate-100 shadow-sm hover:shadow-md hover:border-primary/20"
                      )}
                    >
                      <div className={cn(
                        "p-2 rounded-xl transition-colors",
                        isBreakfast ? "bg-green-600 text-white" : "bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white"
                      )}>
                        {getAmenityIcon(amenity)}
                      </div>
                      <span className={cn(
                        "text-sm font-bold",
                        isBreakfast ? "text-green-800" : "text-slate-700"
                      )}>
                        {t(amenity)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-28 shadow-2xl border-none overflow-hidden rounded-3xl">
              <CardContent className="p-0">
                <div className="bg-primary p-8 text-white">
                  <p className="text-sm font-bold opacity-80 mb-1 uppercase tracking-widest">Offre Exclusive</p>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-4xl font-black">{formatPrice(displayData.price)}</h3>
                    <p className="text-sm font-bold opacity-80">/ {t('per_night')}</p>
                  </div>
                </div>

                <div className="p-8 space-y-8 bg-white">
                  <Button className="w-full h-16 text-xl font-black bg-primary hover:bg-primary/90 shadow-xl rounded-2xl" asChild>
                    <Link href={`/properties/${propertyId}/book`}>Réserver maintenant</Link>
                  </Button>
                  <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-3 border border-dashed border-slate-200">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Paiement 100% sécurisé via StayFloow Pay</p>
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