
"use client";

import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Search as SearchIcon, Loader2, Map as MapIcon, 
  Info, ChevronRight, Calendar as CalendarIcon, MapPin, X
} from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import { CircuitResultCard } from '@/components/circuit-result-card';
import { CircuitSearchSidebar, type CircuitFilterStats } from '@/components/circuit-search-sidebar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { DateRange } from 'react-day-picker';
import { circuits as mockCircuits, type Circuit } from '@/lib/data';

function CircuitResultsContent() {
  const searchParams = useSearchParams();
  const db = useFirestore();
  
  const [allApproved, setAllApproved] = useState<Circuit[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);

  // Search Bar State (Capture 2 Style)
  const [destination, setDestination] = useState(searchParams.get('dest') || '');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: searchParams.get('from') ? new Date(searchParams.get('from')!) : undefined,
    to: searchParams.get('to') ? new Date(searchParams.get('to')!) : undefined,
  });

  const locationParam = searchParams.get('dest') || '';

  useEffect(() => {
    const fetchApprovedCircuits = async () => {
      setLoading(true);
      try {
        const listingsRef = collection(db, 'listings');
        const q = query(
          listingsRef, 
          where('category', '==', 'circuit'),
          where('status', '==', 'approved')
        );
        const querySnapshot = await getDocs(q);
        
        const dbCircuits = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.details?.name || 'Circuit Authentique',
            location: data.location?.address || 'Sahara, Algérie',
            guide: {
              name: data.partnerInfo?.firstName || 'Guide StayFloow',
              email: data.partnerInfo?.email || '',
              phone: data.partnerInfo?.phone || ''
            },
            rating: data.rating || 8.8,
            reviewsCount: Math.floor(Math.random() * 150) + 5,
            duration: data.details?.duration || "3 jours",
            description: data.details?.description || 'Une aventure inoubliable au cœur du désert.',
            images: data.photos || ["https://picsum.photos/seed/desert/400/300"],
            inclusions: data.details?.amenities || ["Guide Pro", "Transport 4x4"],
            pricePerPerson: data.price || 45000,
            ticketTypes: data.details?.ticketTypes || [{ id: 'adult', name: 'Adulte', price: data.price || 45000 }]
          } as Circuit;
        });

        setAllApproved([...mockCircuits, ...dbCircuits]);
      } catch (error) {
        console.error("Error fetching circuits:", error);
        setAllApproved(mockCircuits);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };

    fetchApprovedCircuits();
  }, [db]);

  const stats = useMemo<CircuitFilterStats>(() => {
    const s: CircuitFilterStats = {
      ratings: { "9+": 0, "8+": 0, "7+": 0, "6+": 0 },
      options: {}
    };

    const optionsList = [
      "Guide inclus (local arabe/français)", "Repas inclus (halal)", "Transport 4x4 (désert)",
      "Durée 1 jour", "Durée multi-jours (2-7 jours)", "Annulation gratuite",
      "Langue arabe", "Langue français", "Thème désert/Sahara",
      "Thème culturel/historique (pyramides, ruines)", "Thème Nil/croisière",
      "Groupe petit (max 10 pers)", "Assurance incluse",
      "Départ depuis aéroport (Alger/Caire)", "Rating guide 8+"
    ];
    optionsList.forEach(o => s.options[o] = 0);

    allApproved.forEach(circ => {
      if (circ.rating >= 9) s.ratings["9+"]++;
      if (circ.rating >= 8) s.ratings["8+"]++;
      if (circ.rating >= 7) s.ratings["7+"]++;
      if (circ.rating >= 6) s.ratings["6+"]++;

      circ.inclusions.forEach(opt => {
        if (s.options[opt] !== undefined) s.options[opt]++;
      });
    });

    return s;
  }, [allApproved]);

  const filteredResults = useMemo(() => {
    return allApproved.filter(circ => {
      if (locationParam && !circ.location.toLowerCase().includes(locationParam.toLowerCase())) return false;

      if (selectedOptions.length > 0) {
        const hasAll = selectedOptions.every(opt => circ.inclusions.includes(opt));
        if (!hasAll) return false;
      }

      if (selectedRatings.length > 0) {
        const minRating = Math.min(...selectedRatings.map(r => parseInt(r)));
        if (circ.rating < minRating) return false;
      }

      return true;
    });
  }, [allApproved, locationParam, selectedOptions, selectedRatings]);

  const handleToggleOption = (option: string) => {
    setSelectedOptions(prev => 
      prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]
    );
  };

  const handleToggleRating = (rating: string) => {
    setSelectedRatings(prev => 
      prev.includes(rating) ? prev.filter(r => r !== rating) : [...prev, rating]
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Search Bar (Capture 2 Style) */}
      <div className="bg-[#10B981] pt-6 pb-10 px-4">
        <div className="max-w-[1100px] mx-auto">
          <div className="bg-white p-1 rounded-lg shadow-2xl flex flex-col md:flex-row items-stretch gap-1">
            <div className="flex-[1.5] bg-white rounded flex items-center px-4 py-3 gap-3 focus-within:ring-2 ring-primary transition-all relative">
              <MapPin className="text-slate-400 h-5 w-5" />
              <div className="flex flex-col flex-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase leading-none">Destination</span>
                <input 
                  className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm font-bold text-slate-800 placeholder:text-slate-500 outline-none"
                  placeholder="Où allez-vous ?"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
              {destination && <X className="h-4 w-4 text-slate-400 cursor-pointer" onClick={() => setDestination('')} />}
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <div className="flex-[1.5] bg-white rounded flex items-center px-4 py-3 gap-3 cursor-pointer hover:bg-slate-50 transition-all">
                  <CalendarIcon className="text-slate-400 h-5 w-5" />
                  <div className="flex flex-col flex-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase leading-none">Dates</span>
                    <span className="text-sm font-bold text-slate-800">
                      {dateRange?.from ? (
                        dateRange.to ? `${format(dateRange.from, "dd MMM", { locale: fr })} — ${format(dateRange.to, "dd MMM", { locale: fr })}` 
                        : format(dateRange.from, "dd MMM", { locale: fr })
                      ) : "Sélectionnez des dates"}
                    </span>
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar mode="range" selected={dateRange} onSelect={setDateRange} numberOfMonths={2} locale={fr} disabled={{ before: new Date() }} />
              </PopoverContent>
            </Popover>

            <Button className="md:w-44 bg-primary hover:bg-[#059669] text-white h-14 md:h-auto font-black text-xl rounded shadow-lg">
              Rechercher
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        <aside className="w-full lg:w-[280px] shrink-0 space-y-4">
          <CircuitSearchSidebar 
            resultCount={filteredResults.length} 
            stats={stats}
            selectedOptions={selectedOptions}
            selectedRatings={selectedRatings}
            onToggleOption={handleToggleOption}
            onToggleRating={handleToggleRating}
          />
        </aside>

        <main className="flex-1 space-y-4">
          <h1 className="text-2xl font-bold text-slate-900">
            {locationParam || 'Tous les circuits'} : {filteredResults.length} expériences trouvées
          </h1>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-10 w-10 animate-spin text-[#10B981]" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Préparation de votre itinéraire...</p>
            </div>
          ) : filteredResults.length > 0 ? (
            <div className="flex flex-col gap-4">
              {filteredResults.map((circuit) => (
                <CircuitResultCard key={circuit.id} circuit={circuit} />
              ))}
            </div>
          ) : (
            <div className="py-32 text-center bg-slate-50 rounded-xl border-2 border-dashed">
              <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                <SearchIcon className="h-8 w-8 text-slate-200" />
              </div>
              <h3 className="text-xl font-bold text-slate-400">Aucun circuit trouvé</h3>
              <p className="text-slate-500 mt-2">Élargissez vos thèmes ou changez de zone géographique.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function CircuitResultsPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#10B981]" /></div>}>
      <CircuitResultsContent />
    </Suspense>
  );
}
