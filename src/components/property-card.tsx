"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Zap, Sparkles, AlertCircle, CalendarDays, MapPin, Heart, Utensils } from "lucide-react";
import { cn } from "@/lib/utils";

import type { Property } from "@/lib/data";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "./ui/badge";
import { useCurrency } from "@/context/currency-context";
import { useLanguage } from "@/context/language-context";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

type PropertyCardProps = {
  property: Property;
  isGenius?: boolean;
  viewMode?: "grid" | "list";
};

const getRatingColor = (rating: number) => {
  if (rating >= 8) return "bg-primary";
  if (rating >= 6) return "bg-amber-500";
  return "bg-slate-400";
};

export function PropertyCard({ property, isGenius = false, viewMode = "grid" }: PropertyCardProps) {
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    toast({
      title: isFavorited ? "Retiré des favoris" : "Ajouté aux favoris !",
      description: property.name,
    });
  };

  const hasBreakfast = property.amenities?.some(a => a.toLowerCase().includes('petit-déjeuner') || a.toLowerCase().includes('breakfast'));

  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col md:flex-row group/card border-slate-200 bg-white">
        <div className="relative w-full md:w-[350px] flex-shrink-0 h-64 md:h-auto overflow-hidden">
          <Image
            src={property.images[0] || "https://picsum.photos/seed/stay/800/600"}
            alt={property.name}
            fill
            className="object-cover transition-transform duration-700 group-hover/card:scale-110"
          />
          {isMounted && (
            <Button
              onClick={handleFavoriteToggle}
              className="absolute top-2 right-2 h-10 w-10 flex items-center justify-center rounded-full bg-white/80 text-slate-700 z-10 shadow-lg border-none"
            >
              <Heart className={cn("h-5 w-5", isFavorited && "fill-red-500 text-red-500")} />
            </Button>
          )}
        </div>

        <div className="flex flex-col flex-grow p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-black tracking-tight mb-1">
                <Link href={`/properties/${property.id}`} className="hover:text-primary transition-colors text-slate-900">
                  {property.name}
                </Link>
              </h3>
              <div className="flex items-center gap-2 text-sm text-primary font-bold">
                <MapPin className="h-4 w-4" /> {property.location}
              </div>
            </div>
            <div className={cn("flex items-center justify-center h-10 w-10 text-white font-black rounded-xl", getRatingColor(property.rating))}>
              {property.rating.toFixed(1)}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {hasBreakfast && (
              <Badge className="bg-green-600 text-white font-black border-none px-3 py-1 flex items-center gap-1.5 animate-pulse">
                <Utensils className="h-3 w-3" /> {t('Petit-déjeuner inclus')}
              </Badge>
            )}
            {property.isBoosted && <Badge className="bg-amber-400 text-amber-900 font-black"><Zap className="h-3 w-3 mr-1 fill-current" /> {t('boosted')}</Badge>}
          </div>

          <div className="mt-auto pt-6 flex justify-between items-end border-t border-slate-50">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dès</p>
              <p className="text-3xl font-black text-slate-900 tracking-tighter">{formatPrice(property.price)}</p>
            </div>
            <Button asChild className="bg-primary hover:bg-primary/90 text-white font-black h-12 rounded-xl px-8">
              <Link href={`/properties/${property.id}`}>{t('view_offer')}</Link>
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden flex flex-col h-full transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-slate-200 group/card rounded-3xl bg-white">
      <div className="relative h-56 w-full overflow-hidden">
        <Link href={`/properties/${property.id}`}>
          <Image
            src={property.images[0] || "https://picsum.photos/seed/stay/800/600"}
            alt={property.name}
            fill
            className="object-cover transition-transform duration-700 group-hover/card:scale-110"
          />
        </Link>
        {isMounted && (
          <Button
            onClick={handleFavoriteToggle}
            className="absolute top-3 right-3 h-10 w-10 rounded-full bg-white/80 text-slate-700 z-10 shadow-xl border-none"
          >
            <Heart className={cn("h-5 w-5", isFavorited && "fill-red-500 text-red-500")} />
          </Button>
        )}
        <div className="absolute bottom-3 left-3 flex flex-col gap-2">
          {hasBreakfast && (
            <Badge className="bg-green-600 text-white font-black border-none shadow-lg px-3 py-1 flex items-center gap-1">
              <Utensils className="h-3 w-3" /> {t('Petit-déjeuner inclus')}
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="text-xl font-black text-slate-900 group-hover/card:text-primary transition-colors leading-tight">
            <Link href={`/properties/${property.id}`}>{property.name}</Link>
          </h3>
          <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-lg shrink-0">
            <Star className="w-3.5 h-3.5 fill-primary" />
            <span className="font-black text-sm">{property.rating.toFixed(1)}</span>
          </div>
        </div>
        <p className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1"><MapPin className="h-3 w-3" /> {property.location}</p>
        
        <div className="mt-auto pt-4 flex justify-between items-end border-t border-slate-50">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">{t('from_price')}</p>
            <p className="font-black text-2xl text-slate-900 tracking-tighter">{formatPrice(property.price)}</p>
          </div>
          <Button size="sm" variant="ghost" className="text-primary font-black p-0" asChild>
            <Link href={`/properties/${property.id}`}>{t('search')} <Zap className="h-3 w-3 fill-current" /></Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}