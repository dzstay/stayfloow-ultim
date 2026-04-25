"use client";

import { Providers } from "@/components/providers";
import React from "react";
import { Locale } from "@/lib/translations";

/**
 * @fileOverview Wrapper client principal pour les fournisseurs de contexte.
 * Assure que tous les contextes (Langue, Devise) sont correctement injectés dans l'arbre des composants.
 */
export default function ClientProviders({ 
  children,
  initialLocale
}: { 
  children: React.ReactNode,
  initialLocale?: Locale 
}) {
  return <Providers initialLocale={initialLocale}>{children}</Providers>;
}
