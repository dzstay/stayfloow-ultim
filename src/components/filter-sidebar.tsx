"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { popularFilters, propertyTypesList } from "@/lib/data";
import { useCurrency } from "@/context/currency-context";
import { useLanguage } from "@/context/language-context";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FilterSidebar({ resultCount }: { resultCount: number }) {
  const { formatPrice, convertFromDZD, currency } = useCurrency();
  const { t } = useLanguage();

  const maxPriceDZD = 30000;
  const maxPriceConverted =
    Math.ceil(convertFromDZD(maxPriceDZD)) || maxPriceDZD;

  const [priceRange, setPriceRange] = useState([
    convertFromDZD(3000) || 3000,
    convertFromDZD(20000) || 20000,
  ]);

  return (
    <Card className="sticky top-24 border-none shadow-xl rounded-3xl overflow-hidden bg-white">
      <CardHeader className="p-6 bg-slate-50 border-b border-slate-100">
        <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-800">{t('filters')}</CardTitle>
      </CardHeader>

      <CardContent className="p-0 max-h-[calc(100vh-12rem)] overflow-y-auto">
        <Accordion type="multiple" className="w-full" defaultValue={["budget", "popular"]}>

          {/* Budget */}
          <AccordionItem value="budget" className="border-slate-100">
            <AccordionTrigger className="px-6 py-4 font-bold text-sm hover:no-underline hover:bg-slate-50">
              {t('budget_per_night')}
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 pt-2 space-y-6">
              <Slider
                value={priceRange}
                max={maxPriceConverted}
                step={currency === "DZD" ? 500 : 5}
                onValueChange={setPriceRange}
                className="mt-4"
              />

              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="font-black text-primary text-xs">{formatPrice(priceRange[0])}</span>
                <span className="font-black text-primary text-xs">{formatPrice(priceRange[1])}</span>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Populaires */}
          <AccordionItem value="popular" className="border-slate-100">
            <AccordionTrigger className="px-6 py-4 font-bold text-sm hover:no-underline hover:bg-slate-50">
              {t('popular')}
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 pt-2 space-y-3">
              {popularFilters.map((item) => (
                <div key={item} className="flex items-center space-x-3 group cursor-pointer">
                  <Checkbox id={`popular-${item}`} className="h-5 w-5 rounded-md border-slate-300" />
                  <Label htmlFor={`popular-${item}`} className="font-bold text-slate-600 text-sm group-hover:text-primary transition-colors cursor-pointer">
                    {t(item)}
                  </Label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>

          {/* Types de propriétés */}
          <AccordionItem value="types" className="border-none">
            <AccordionTrigger className="px-6 py-4 font-bold text-sm hover:no-underline hover:bg-slate-50">
              {t('property_types')}
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 pt-2 space-y-3">
              {propertyTypesList.map((item) => (
                <div key={item} className="flex items-center space-x-3 group cursor-pointer">
                  <Checkbox id={`type-${item}`} className="h-5 w-5 rounded-md border-slate-300" />
                  <Label htmlFor={`type-${item}`} className="font-bold text-slate-600 text-sm group-hover:text-primary transition-colors cursor-pointer">
                    {t(item)}
                  </Label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>

        </Accordion>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
          <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-black rounded-xl shadow-lg">
            {t('show_results')} ({resultCount || 0})
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}