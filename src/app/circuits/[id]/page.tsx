
"use client";

import React, { use, useState } from 'react';
import { circuits as mockCircuits, type Circuit } from '@/lib/data';
import { 
  ChevronLeft, Star, Clock, MapPin, Share2, Heart, 
  Check, Info, X, Users, Calendar as CalendarIcon, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCurrency } from '@/context/currency-context';
import { useLanguage } from '@/context/language-context';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export default function CircuitDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();

  const circuit = mockCircuits.find(c => c.id === id) || mockCircuits[0];

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [ticketCounts, setTicketCounts] = useState<Record<string, number>>(
    circuit.ticketTypes.reduce((acc, t) => ({ ...acc, [t.id]: t.id === 'adult' ? 1 : 0 }), {})
  );

  const updateCount = (id: string, delta: number) => {
    setTicketCounts(prev => ({
      ...prev,
      [id]: Math.max(0, prev[id] + delta)
    }));
  };

  const totalPrice = circuit.ticketTypes.reduce(
    (acc, ticket) => acc + (ticket.price * ticketCounts[ticket.id]), 
    0
  );

  const handleBooking = () => {
    const params = new URLSearchParams({
      id: circuit.id,
      date: selectedDate?.toISOString() || '',
      tickets: JSON.stringify(ticketCounts),
      total: totalPrice.toString()
    });
    router.push(`/circuits/book?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header Sticky */}
      <div className="bg-white/80 backdrop-blur-md border-b sticky top-16 z-40 py-3 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Button variant="ghost" onClick={() => router.back()} className="font-bold text-slate-600 hover:text-primary transition-colors">
            <ChevronLeft className="mr-2 h-4 w-4" /> {t('back')}
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" size="icon" className="rounded-full"><Share2 className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" className="rounded-full"><Heart className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Info */}
          <div className="space-y-4">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">{circuit.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-slate-500">
              <div className="flex items-center gap-1"><Star className="h-4 w-4 text-amber-400 fill-amber-400" /> {circuit.rating} ({circuit.reviewsCount} commentaires)</div>
              <div className="flex items-center gap-1"><Clock className="h-4 w-4" /> {circuit.duration}</div>
              <div className="flex items-center gap-1 text-primary hover:underline cursor-pointer"><MapPin className="h-4 w-4" /> {circuit.location}</div>
            </div>
          </div>

          {/* Photo Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
            <div className="relative aspect-square md:aspect-auto h-full">
              <Image src={circuit.images[0]} alt="Hero" fill className="object-cover" />
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="relative aspect-video">
                <Image src={circuit.images[1] || circuit.images[0]} alt="Gallery" fill className="object-cover" />
              </div>
              <div className="relative aspect-video bg-slate-200 flex items-center justify-center">
                <span className="font-black text-slate-400 text-lg">Voir toutes les photos</span>
              </div>
            </div>
          </div>

          {/* Configuration / Description (Capture 4 Style) */}
          <div className="space-y-10 bg-white p-8 rounded-3xl shadow-xl">
            {/* Annulation Info */}
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-full"><Check className="h-5 w-5 text-primary" /></div>
              <div>
                <h4 className="font-black text-lg text-slate-900">Annulation gratuite</h4>
                <p className="text-slate-500 text-sm">Annulez jusqu'à 24 heures à l'avance pour un remboursement intégral.</p>
              </div>
            </div>

            <Separator />

            {/* Langues */}
            <div className="space-y-4">
              <h4 className="font-black text-lg text-slate-900">Langues disponibles</h4>
              <div className="flex flex-wrap gap-3">
                {circuit.languages.map(lang => (
                  <Badge key={lang} variant="secondary" className="bg-slate-100 text-slate-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2">
                    {lang === 'Français' ? '🇫🇷' : lang === 'Arabe' ? '🇩🇿' : lang === 'Anglais' ? '🇬🇧' : '🌍'} {lang}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Description Longue */}
            <div className="space-y-4">
              <h4 className="font-black text-xl text-slate-900">Présentation de l'excursion</h4>
              <p className="text-slate-600 leading-relaxed text-lg font-medium italic">"{circuit.longDescription}"</p>
            </div>

            {/* Inclusions / Exclusions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-black text-lg text-slate-900">Services inclus</h4>
                <ul className="space-y-3">
                  {circuit.inclusions.map(inc => (
                    <li key={inc} className="flex items-start gap-3 text-sm font-bold text-slate-600">
                      <Check className="h-5 w-5 text-primary shrink-0" /> {inc}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-black text-lg text-slate-900">Restrictions</h4>
                <ul className="space-y-3">
                  {circuit.restrictions.map(res => (
                    <li key={res} className="flex items-start gap-3 text-sm font-bold text-slate-400">
                      <X className="h-5 w-5 text-red-400 shrink-0" /> {res}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Tickets & Total (Capture 3 Style) */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 space-y-6">
            <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-white">
              <CardHeader className="bg-slate-900 text-white p-6">
                <CardTitle className="text-lg font-black uppercase tracking-tight">Réserver vos tickets</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Date Selection */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Date du tour</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full h-12 justify-start font-bold border-slate-200">
                        <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                        {selectedDate ? format(selectedDate, "dd MMMM yyyy", { locale: fr }) : "Choisir une date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} locale={fr} disabled={{ before: new Date() }} />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Ticket Types */}
                <div className="space-y-4">
                  {circuit.ticketTypes.map((type) => (
                    <div key={type.id} className="flex items-center justify-between py-2 border-b last:border-0 border-slate-50">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{type.name}</p>
                        <p className="text-[10px] text-slate-400">{formatPrice(type.price)}</p>
                      </div>
                      <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1 border">
                        <button onClick={() => updateCount(type.id, -1)} className="h-8 w-8 flex items-center justify-center text-primary hover:bg-white rounded"><X className="h-3 w-3" /></button>
                        <span className="w-4 text-center font-black text-sm">{ticketCounts[type.id]}</span>
                        <button onClick={() => updateCount(type.id, 1)} className="h-8 w-8 flex items-center justify-center text-primary hover:bg-white rounded"><Check className="h-3 w-3" /></button>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold text-slate-500">Total à payer</span>
                    <div className="text-right">
                      <p className="text-3xl font-black text-[#10B981] tracking-tighter">{formatPrice(totalPrice)}</p>
                      <p className="text-[10px] text-slate-400 font-medium">Taxes et frais compris</p>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleBooking}
                  disabled={totalPrice === 0}
                  className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-black text-lg rounded-xl shadow-xl shadow-primary/20"
                >
                  Suivant
                </Button>
              </CardContent>
            </Card>

            <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 flex gap-4">
              <ShieldCheck className="h-8 w-8 text-primary shrink-0" />
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                <strong>Réservez maintenant, payez plus tard :</strong> sécurisez votre place dès aujourd'hui sans rien payer maintenant sur StayFloow.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
