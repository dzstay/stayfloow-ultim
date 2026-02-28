"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Heart, MapPin, ChevronRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Property } from "@/lib/data";
import { Badge } from "./ui/badge";
import { useCurrency } from "@/context/currency-context";
import { Button } from "./ui/button";
import { useState } from "react";

interface PropertyCardProps {
  property: Property;
  viewMode?: "grid" | "list";
}

export function PropertyCard({ property, viewMode = "list" }: PropertyCardProps) {
  const { formatPrice } = useCurrency();
  const [isFavorite, setIsFavorited] = useState(false);

  const ratingText = property.rating >= 9 ? "Fabuleux" : property.rating >= 8.5 ? "Exceptionnel" : property.rating >= 8 ? "Très bien" : "Bien";

  if (viewMode === "grid") {
    return (
      <div className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow group flex flex-col page-fade-in">
        <div className="relative aspect-[4/3] w-full">
          <Image 
            src={property.images[0] || 'https://picsum.photos/seed/stay/400/300'} 
            alt={property.name} 
            fill 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover"
          />
          <button 
            onClick={(e) => { e.preventDefault(); setIsFavorited(!isFavorite); }}
            className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm z-10"
          >
            <Heart className={cn("h-4 w-4 transition-colors", isFavorite ? "fill-red-500 text-red-500" : "text-slate-600 hover:text-[#10B981]")} />
          </button>
        </div>
        <div className="p-4 flex flex-col flex-1">
          <div className="flex justify-between items-start gap-2 mb-1">
            <h3 className="font-bold text-slate-900 group-hover:text-[#059669] transition-colors leading-tight line-clamp-2">
              {property.name}
            </h3>
            <div className="flex flex-col items-end shrink-0">
              <div className="bg-[#10B981] text-white font-bold text-xs px-1.5 py-1 rounded-sm">
                {property.rating.toFixed(1)}
              </div>
            </div>
          </div>
          <p className="text-[12px] text-slate-500 flex items-center gap-1 mb-3">
            <MapPin className="h-3 w-3" /> {property.location}
          </p>
          <div className="mt-auto pt-3 border-t flex justify-between items-end">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">À partir de</p>
              <p className="text-xl font-bold text-[#10B981] tracking-tighter">{formatPrice(property.price)}</p>
            </div>
            <Link href={`/properties/${property.id}`}>
              <Button size="sm" className="bg-[#10B981] hover:bg-[#059669] h-8 rounded-md px-3 text-xs">Détails</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-md overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow group p-4 gap-4 page-fade-in">
      {/* Photo (Exact 200x150 sur desktop) */}
      <div className="relative w-full md:w-[240px] h-[180px] shrink-0 rounded-md overflow-hidden">
        <Image 
          src={property.images[0] || 'https://picsum.photos/seed/stay/400/300'} 
          alt={property.name} 
          fill 
          sizes="(max-width: 768px) 100vw, 240px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button 
          onClick={(e) => { e.preventDefault(); setIsFavorited(!isFavorite); }}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm z-10"
        >
          <Heart className={cn("h-5 w-5 transition-colors", isFavorite ? "fill-red-500 text-red-500" : "text-slate-600 hover:text-[#10B981]")} />
        </button>
      </div>

      {/* Details (Middle) */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex justify-between items-start gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Link href={`/properties/${property.id}`}>
                <h3 className="text-[18px] font-bold text-[#10B981] hover:text-[#059669] hover:underline transition-all truncate leading-tight">
                  {property.name}
                </h3>
              </Link>
              {property.stars && (
                <div className="flex">
                  {[...Array(property.stars)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-[#FEBA02] text-[#FEBA02]" />
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-[12px] mb-2">
              <span className="text-[#10B981] font-bold underline cursor-pointer">Indiquer sur la carte</span>
              <span className="text-slate-500">{property.location}</span>
              <span className="text-slate-500">• 3.8 km du centre</span>
            </div>
          </div>

          <div className="flex items-start gap-3 shrink-0">
            <div className="text-right hidden sm:block">
              <p className="font-bold text-slate-900 leading-none mb-1">{ratingText}</p>
              <p className="text-[11px] text-slate-500 italic">8 501 expériences vécues</p>
            </div>
            <div className="bg-[#10B981] text-white font-bold text-lg w-9 h-9 flex items-center justify-center rounded-sm rounded-bl-none">
              {property.rating.toFixed(1)}
            </div>
          </div>
        </div>

        <div className="mt-2 space-y-2">
          <Badge className="bg-[#34D399]/20 text-[#065f46] border-none font-bold text-[11px] py-0.5 px-2">
            Recommandé pour votre groupe
          </Badge>
          
          <div className="border-l-2 border-slate-100 pl-3 py-1">
            <p className="font-bold text-[13px]">Chambre Quadruple</p>
            <p className="text-[12px] text-slate-500">4 lits (2 lits simples, 2 lits superposés)</p>
          </div>

          <p className="text-[#059669] text-[12px] font-bold flex items-center gap-1.5">
            <ChevronRight className="h-3 w-3" /> Aucun prépaiement requis - Payez sur place
          </p>
        </div>
      </div>

      {/* Pricing (Right) */}
      <div className="md:w-48 flex flex-col justify-end md:items-end text-right gap-2 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-4">
        <p className="text-[11px] text-slate-500 leading-none">1 nuit, 2 adultes, 2 enfants</p>
        <div>
          <p className="text-[22px] font-bold text-[#10B981] leading-none">{formatPrice(property.price)}</p>
          <p className="text-[11px] text-slate-500 mt-1">Taxes et frais compris</p>
        </div>
        <Link href={`/properties/${property.id}`} className="w-full">
          <Button className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-black h-10 rounded-md group/btn flex items-center justify-between px-4">
            Voir les disponibilités
            <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
