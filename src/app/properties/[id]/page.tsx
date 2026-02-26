
'use client';

import React, { use } from 'react';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { 
  MapPin, Star, Share2, Heart, ShieldCheck, 
  Wifi, Coffee, Car, Wind, ChevronLeft, 
  ChevronRight, Calendar as CalendarIcon, Loader2
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
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const db = useFirestore();
  const docRef = doc(db, 'listings', id);
  const { data: property, loading } = useDoc(docRef);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // Fallback if document doesn't exist (mock data for presentation if DB is empty)
  const displayData = property || {
    details: {
      name: "Villa d'Exception StayFloow",
      description: "Découvrez le luxe et l'authenticité dans cette propriété unique sélectionnée par nos experts. Un séjour inoubliable vous attend avec des prestations haut de gamme et une vue imprenable.",
      amenities: ["WiFi gratuit", "Piscine", "Climatisation", "Parking gratuit", "Petit-déjeuner"],
    },
    location: { address: "Alger, Algérie", lat: 36.75, lng: 3.05 },
    price: 15000,
    photos: [
      "https://picsum.photos/seed/prop-detail-1/1200/800",
      "https://picsum.photos/seed/prop-detail-2/1200/800",
      "https://picsum.photos/seed/prop-detail-3/1200/800"
    ]
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navigation Header */}
      <header className="bg-white border-b sticky top-0 z-50 py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Button variant="ghost" onClick={() => router.back()} className="font-bold text-slate-600">
            <ChevronLeft className="mr-2 h-4 w-4" /> Retour
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="rounded-full"><Share2 className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" className="rounded-full"><Heart className="h-4 w-4" /></Button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content (Left Column) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <div className="rounded-3xl overflow-hidden shadow-2xl bg-slate-200 aspect-video relative group">
              <Carousel className="w-full h-full">
                <CarouselContent>
                  {displayData.photos?.map((photo: string, index: number) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-video w-full">
                        <Image 
                          src={photo} 
                          alt={`${displayData.details?.name} - Photo ${index + 1}`} 
                          fill 
                          className="object-cover"
                          priority={index === 0}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CarouselNext className="right-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Carousel>
              <div className="absolute bottom-4 right-4 bg-black/60 text-white px-4 py-2 rounded-full text-xs font-bold backdrop-blur-md">
                1 / {displayData.photos?.length || 1} photos
              </div>
            </div>

            {/* Header Info */}
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight">{displayData.details?.name}</h1>
                  <p className="flex items-center gap-1 text-primary font-bold mt-2 underline cursor-pointer">
                    <MapPin className="h-4 w-4" /> {displayData.location?.address}
                  </p>
                </div>
                <div className="bg-primary/5 p-4 rounded-2xl flex flex-col items-center border border-primary/10">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Note</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                    <span className="text-2xl font-black text-primary">9.8</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">Coup de cœur voyageurs</Badge>
                <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10">Vérifié par StayFloow</Badge>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900">À propos de cet hébergement</h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                {displayData.details?.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="space-y-6 pt-4">
              <h2 className="text-2xl font-black text-slate-900">Ce que propose ce logement</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {displayData.details?.amenities?.map((amenity: string) => (
                  <div key={amenity} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div className="bg-primary/5 p-2 rounded-lg text-primary">
                      {amenity.toLowerCase().includes('wifi') && <Wifi className="h-5 w-5" />}
                      {amenity.toLowerCase().includes('petit') && <Coffee className="h-5 w-5" />}
                      {amenity.toLowerCase().includes('clim') && <Wind className="h-5 w-5" />}
                      {amenity.toLowerCase().includes('park') && <Car className="h-5 w-5" />}
                      {!['wifi', 'petit', 'clim', 'park'].some(k => amenity.toLowerCase().includes(k)) && <ShieldCheck className="h-5 w-5" />}
                    </div>
                    <span className="text-sm font-bold text-slate-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Sidebar (Right Column) */}
          <div className="lg:col-span-1">
            <Card className="sticky top-28 shadow-2xl border-none overflow-hidden rounded-3xl">
              <CardContent className="p-0">
                <div className="bg-primary p-6 text-white">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm opacity-80 mb-1">À partir de</p>
                      <h3 className="text-3xl font-black">{displayData.price?.toLocaleString()} DZD</h3>
                    </div>
                    <p className="text-sm font-bold opacity-80">par nuit</p>
                  </div>
                </div>

                <div className="p-8 space-y-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <CalendarIcon className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Dates</p>
                          <p className="font-bold text-sm">Sélectionner les dates</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <Star className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Voyageurs</p>
                          <p className="font-bold text-sm">2 adultes, 0 enfant</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </div>
                  </div>

                  <Button className="w-full h-16 text-xl font-black bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 rounded-2xl">
                    Réserver maintenant
                  </Button>

                  <p className="text-center text-xs text-slate-400">
                    Vous ne serez pas débité immédiatement sur StayFloow.com.
                  </p>

                  <Separator />

                  <div className="space-y-4 pt-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 underline">15 000 DZD x 3 nuits</span>
                      <span className="font-bold">45 000 DZD</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 underline">Frais StayFloow.com</span>
                      <span className="font-bold">0 DZD</span>
                    </div>
                    <div className="flex justify-between text-lg font-black pt-2 border-t text-slate-900">
                      <span>Total</span>
                      <span>45 000 DZD</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-2xl">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Protection StayFloow</h4>
                <p className="text-xs text-slate-500">Chaque réservation est protégée contre les annulations d'hôtes.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-primary text-white py-12 px-8 text-center mt-12">
        <p className="opacity-50 text-sm">© 2025 StayFloow.com. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
