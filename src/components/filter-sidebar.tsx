"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Star, Search, ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export function FilterSidebar({ resultCount }: { resultCount: number }) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Title with Green Star */}
      <div className="flex items-center gap-2 border-b pb-4">
        <div className="bg-[#10B981] p-1.5 rounded-sm">
          <Star className="h-4 w-4 text-white fill-white" />
        </div>
        <h2 className="text-[18px] font-bold text-[#10B981]">Filtres intelligents</h2>
      </div>

      {/* Quick Search */}
      <div className="space-y-2">
        <Label className="font-bold text-slate-900">Que recherchez-vous ?</Label>
        <div className="relative">
          <input 
            className="w-full bg-slate-50 border rounded-md h-10 pl-3 pr-10 text-[13px] focus:ring-2 ring-[#10B981]/20 outline-none"
            placeholder="Exemple : annulation gratuite..."
          />
          <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
        </div>
        <Button className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-bold rounded-md h-10 shadow-sm">
          Trouver des hébergements
        </Button>
      </div>

      {/* Ratings Section */}
      <div className="space-y-4 pt-4">
        <h3 className="text-[16px] font-bold text-slate-900">Note des commentaires</h3>
        <div className="space-y-3">
          <FilterRow label="Fabuleux : 9+" count={16} id="rate-9" />
          <FilterRow label="Très bien : 8+" count={71} id="rate-8" />
          <FilterRow label="Bien : 7+" count={82} id="rate-7" />
          <FilterRow label="Agréable : 6+" count={86} id="rate-6" />
        </div>
      </div>

      {/* Popular Filters (Mocked) */}
      <div className="space-y-4 pt-4">
        <h3 className="text-[16px] font-bold text-slate-900">Filtres populaires</h3>
        <div className="space-y-3">
          <FilterRow label="Petit-déjeuner compris" count={59} id="pop-1" />
          <FilterRow label="Hôtel" count={64} id="pop-2" />
          <FilterRow label="Connexion Wi-Fi gratuite" count={93} id="pop-3" />
          <FilterRow label="Parking" count={68} id="pop-4" />
        </div>
      </div>
    </div>
  );
}

function FilterRow({ label, count, id }: { label: string, count: number, id: string }) {
  return (
    <div className="flex items-center justify-between group cursor-pointer">
      <div className="flex items-center space-x-3">
        <Checkbox id={id} className="h-5 w-5 rounded-sm border-slate-300 data-[state=checked]:bg-[#10B981] data-[state=checked]:border-[#10B981]" />
        <Label htmlFor={id} className="text-sm font-medium text-slate-900 group-hover:text-[#10B981] transition-colors cursor-pointer">
          {label}
        </Label>
      </div>
      <span className="text-[12px] text-slate-400 font-medium">{count}</span>
    </div>
  );
}