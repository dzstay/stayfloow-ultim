
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Calendar as CalendarIcon, Users, Search, Minus, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';

export default function AdvancedSearchBar() {
  const [destination, setDestination] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [occupancy, setOccupancy] = useState({ adults: 2, children: 0, rooms: 1 });
  const [activeStep, setActiveStep] = useState<'destination' | 'dates' | 'occupancy' | null>(null);

  // Auto-advance logic
  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      setTimeout(() => setActiveStep('occupancy'), 300);
    }
  }, [dateRange]);

  const handleSearch = () => {
    console.log("Searching for:", { destination, dateRange, occupancy });
    window.location.href = `/search?dest=${destination}&from=${dateRange?.from?.toISOString()}&to=${dateRange?.to?.toISOString()}`;
  };

  return (
    <div className="bg-orange-400 p-1 rounded-xl shadow-2xl">
      <div className="bg-white rounded-lg flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x border-2 border-orange-400">
        
        {/* Destination Section */}
        <div className={cn(
          "flex-1 p-4 flex items-center gap-3 transition-colors cursor-text relative",
          activeStep === 'destination' && "bg-accent/50"
        )} onClick={() => setActiveStep('destination')}>
          <MapPin className="text-primary h-6 w-6 shrink-0" />
          <div className="flex flex-col w-full">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Destination</span>
            <input 
              className="bg-transparent border-none focus:ring-0 p-0 text-base font-medium placeholder:text-muted-foreground w-full outline-none"
              placeholder="Où allez-vous ?"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              autoFocus={activeStep === 'destination'}
            />
          </div>
        </div>

        {/* Calendar Section */}
        <Popover open={activeStep === 'dates'} onOpenChange={(open) => setActiveStep(open ? 'dates' : null)}>
          <PopoverTrigger asChild>
            <div className={cn(
              "flex-1 p-4 flex items-center gap-3 transition-colors cursor-pointer",
              activeStep === 'dates' && "bg-accent/50"
            )}>
              <CalendarIcon className="text-primary h-6 w-6 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Dates</span>
                <span className="text-base font-medium whitespace-nowrap">
                  {dateRange?.from ? (
                    dateRange.to ? (
                      `${format(dateRange.from, "dd MMM", { locale: fr })} — ${format(dateRange.to, "dd MMM", { locale: fr })}`
                    ) : format(dateRange.from, "dd MMM", { locale: fr })
                  ) : "Arrivée — Départ"}
                </span>
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 border-none shadow-2xl" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
              locale={fr}
              className="rounded-lg border-2 border-primary"
            />
          </PopoverContent>
        </Popover>

        {/* Occupancy Section */}
        <Popover open={activeStep === 'occupancy'} onOpenChange={(open) => setActiveStep(open ? 'occupancy' : null)}>
          <PopoverTrigger asChild>
            <div className={cn(
              "flex-1 p-4 flex items-center gap-3 transition-colors cursor-pointer",
              activeStep === 'occupancy' && "bg-accent/50"
            )}>
              <Users className="text-primary h-6 w-6 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Occupants</span>
                <span className="text-base font-medium whitespace-nowrap">
                  {occupancy.adults} ad, {occupancy.children} enf · {occupancy.rooms} ch.
                </span>
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-6" align="end">
            <div className="space-y-6">
              <OccupancyRow 
                label="Adultes" 
                value={occupancy.adults} 
                onDec={() => setOccupancy({...occupancy, adults: Math.max(1, occupancy.adults - 1)})}
                onInc={() => setOccupancy({...occupancy, adults: occupancy.adults + 1})}
              />
              <OccupancyRow 
                label="Enfants" 
                value={occupancy.children} 
                onDec={() => setOccupancy({...occupancy, children: Math.max(0, occupancy.children - 1)})}
                onInc={() => setOccupancy({...occupancy, children: occupancy.children + 1})}
              />
              <OccupancyRow 
                label="Chambres" 
                value={occupancy.rooms} 
                onDec={() => setOccupancy({...occupancy, rooms: Math.max(1, occupancy.rooms - 1)})}
                onInc={() => setOccupancy({...occupancy, rooms: occupancy.rooms + 1})}
              />
              <Button className="w-full bg-primary" onClick={() => setActiveStep(null)}>Terminé</Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Search Button */}
        <div className="p-2 md:w-32 flex items-center justify-center">
          <Button className="w-full h-full bg-primary hover:bg-primary/90 text-lg rounded-md py-4 font-bold" onClick={handleSearch}>
            Rechercher
          </Button>
        </div>
      </div>
    </div>
  );
}

function OccupancyRow({ label, value, onDec, onInc }: { label: string, value: number, onDec: () => void, onInc: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-bold text-primary">{label}</span>
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-primary text-primary" onClick={onDec}>
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-4 text-center font-bold">{value}</span>
        <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-primary text-primary" onClick={onInc}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
