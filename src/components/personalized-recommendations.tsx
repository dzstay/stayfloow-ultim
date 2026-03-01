"use client";

import { properties } from "@/lib/data";
import { PropertyCard } from "./property-card";
import { Eye, LayoutGrid, Lightbulb, List } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export function PersonalizedRecommendations() {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMounted, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const recentlyViewed = properties.slice(0, 4);
  const similarToLastViewed = properties.slice(4, 8);

  const getButtonClass = (mode: 'grid' | 'list') =>
    `h-10 w-10 flex items-center justify-center rounded-xl border transition-all ${
      viewMode === mode
        ? "bg-secondary text-primary border-secondary shadow-lg"
        : "bg-white text-slate-400 hover:text-primary border-slate-100 shadow-sm"
    }`;

  if (!isMounted) return null;

  return (
    <div className="space-y-16 py-12">
      {/* SECTION 1 : Récemment consultés */}
      <section>
        <div className="flex items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-2xl">
              <Eye className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                {t('recently_viewed')}
              </h2>
              <p className="text-sm text-slate-500 font-medium uppercase tracking-widest mt-1">Vos dernières recherches sur StayFloow</p>
            </div>
          </div>

          {/* Boutons de mode de vue */}
          <div className="hidden md:flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
            <Button
              variant="ghost"
              onClick={() => setViewMode('grid')}
              className={getButtonClass('grid')}
            >
              <LayoutGrid className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              onClick={() => setViewMode('list')}
              className={getButtonClass('list')}
            >
              <List className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div
          className={cn(
            "grid gap-8",
            viewMode === 'grid'
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              : "grid-cols-1"
          )}
        >
          {recentlyViewed.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              viewMode={viewMode}
            />
          ))}
        </div>
      </section>

      {/* SECTION 2 : Inspirés par votre visite */}
      <section>
        <div className="flex items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-2xl">
              <Lightbulb className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                {t('inspired_by_visit')}
              </h2>
              <p className="text-sm text-slate-500 font-medium uppercase tracking-widest mt-1">Sélectionnés par notre algorithme IA</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
            <Button
              variant="ghost"
              onClick={() => setViewMode('grid')}
              className={getButtonClass('grid')}
            >
              <LayoutGrid className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              onClick={() => setViewMode('list')}
              className={getButtonClass('list')}
            >
              <List className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div
          className={cn(
            "grid gap-8",
            viewMode === 'grid'
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              : "grid-cols-1"
          )}
        >
          {similarToLastViewed.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              viewMode={viewMode}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
