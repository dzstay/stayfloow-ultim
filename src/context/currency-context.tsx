'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Currency = "DZD" | "EUR" | "USD" | "GBP" | "CHF" | "EGP";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (price: number) => string;
  getCurrencySymbol: (c: Currency) => string;
  getCurrencyFlag: (c: Currency) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('DZD');

  const getCurrencySymbol = (c: Currency): string => {
    const symbols: Record<Currency, string> = {
      DZD: "DZD",
      EUR: "€",
      USD: "$",
      GBP: "£",
      CHF: "CHF",
      EGP: "EGP"
    };
    return symbols[c];
  };

  const getCurrencyFlag = (c: Currency): string => {
    const flags: Record<Currency, string> = {
      DZD: "🇩🇿",
      EUR: "🇪🇺",
      USD: "🇺🇸",
      GBP: "🇬🇧",
      CHF: "🇨🇭",
      EGP: "🇪🇬"
    };
    return flags[c];
  };

  const formatPrice = (price: number) => {
    // Simple conversion logic for demo (replace with real rates if needed)
    const rates: Record<Currency, number> = {
      DZD: 1,
      EUR: 0.0068,
      USD: 0.0074,
      GBP: 0.0058,
      CHF: 0.0065,
      EGP: 0.35
    };
    
    const convertedPrice = price * rates[currency];

    return new Intl.NumberFormat(currency === 'DZD' ? 'fr-DZ' : 'en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(convertedPrice);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, getCurrencySymbol, getCurrencyFlag }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within a CurrencyProvider');
  return context;
}
