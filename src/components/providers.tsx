
"use client";

import { CurrencyProvider } from "@/context/currency-context";
import { LanguageProvider } from "@/context/language-context";
import React from "react";
import { Locale } from "@/lib/translations";

/**
 * @fileOverview Composant de regroupement des providers client (Langue, Devise).
 * Fournit les contextes nécessaires à l'ensemble de l'application, y compris lors du rendu serveur.
 */
export function Providers({ 
  children,
  initialLocale 
}: { 
  children: React.ReactNode,
  initialLocale?: Locale 
}) {
  return (
    <LanguageProvider initialLocale={initialLocale}>
      <CurrencyProvider>
        {children}
      </CurrencyProvider>
    </LanguageProvider>
  );
}
