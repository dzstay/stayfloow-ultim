'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';

export type Locale = 'fr' | 'en' | 'ar' | 'es';

const localeDetails: Record<Locale, { name: string; flag: string; dir: 'ltr' | 'rtl' }> = {
    fr: { name: 'Français', flag: '🇫🇷', dir: 'ltr' },
    en: { name: 'English', flag: '🇬🇧', dir: 'ltr' },
    ar: { name: 'العربية', flag: '🇩🇿', dir: 'rtl' },
    es: { name: 'Español', flag: '🇪🇸', dir: 'ltr' },
};

const translations: Record<string, Record<Locale, string>> = {
    // Global
    "accommodations": { fr: "Hébergements", en: "Accommodations", ar: "أماكن الإقامة", es: "Alojamientos" },
    "car_rental": { fr: "Voitures", en: "Car Rental", ar: "تأجير السيارات", es: "Alquiler de Coches" },
    "tours": { fr: "Circuits", en: "Tours & Activities", ar: "الجولات والأنشطة", es: "Tours y Actividades" },
    "login": { fr: "Se connecter", en: "Log In", ar: "تسجيل الدخول", es: "Iniciar sesión" },
    "register": { fr: "S'inscrire", en: "Sign Up", ar: "إنشاء حساب", es: "Registrarse" },
    "search_btn": { fr: "Rechercher", en: "Search", ar: "بحث", es: "Buscar" },
    
    // Composition & Specifics
    "chambers": { fr: "Chambres", en: "Bedrooms", ar: "غرف نوم", es: "Dormitorios" },
    "bathrooms": { fr: "Salles de bain", en: "Bathrooms", ar: "حمامات", es: "Baños" },
    "kitchens": { fr: "Cuisines", en: "Kitchens", ar: "مابخ", es: "Cocinas" },
    "living_rooms": { fr: "Salons", en: "Salons", ar: "صالات", es: "Salones" },
    "gardens": { fr: "Jardins", en: "Gardens", ar: "حدائق", es: "Jardines" },
    "single_rooms": { fr: "Chambres seules", en: "Single Rooms", ar: "غرف فردية", es: "Habitaciones individuales" },
    "parental_suites": { fr: "Suites parentales King Size", en: "King Size Suites", ar: "أجنحة ملكية", es: "Suites parentales King Size" },
    "double_rooms": { fr: "Chambres doubles", en: "Double Rooms", ar: "غرف مزدوجة", es: "Habitaciones dobles" },
    
    // Home Page
    "hero_title": { fr: "Des séjours inoubliables pour tous les budgets.", en: "Incredible stays for every budget.", ar: "إقامات لا تنسى لجميع الميزانيات.", es: "Estancias inolvidables para todos los presupuestos." },
    "hero_subtitle": { fr: "Économisez 15 % ou plus sur vos réservations de 2026 grâce aux offres StayFloow.", en: "Save 15% or more on 2026 bookings with StayFloow deals.", ar: "وفر 15% أو أكثر على حجوزات 2026 مع عروض StayFloow.", es: "Ahorra un 15% o más en reservas de 2026 con ofertas de StayFloow." },
    "hero_cta": { fr: "Se connecter ou créer un compte", en: "Sign in or create account", ar: "تسجيل الدخول أو إنشاء حساب", es: "Iniciar sesión o crear cuenta" },
    "exclusive_offers": { fr: "Offres Exclusives 2026", en: "2026 Exclusive Deals", ar: "عروض حصرية 2026", es: "Ofertas Exclusivas 2026" },
    "property_types_title": { fr: "Rechercher par type d'hébergement", en: "Browse by property type", ar: "بحث حسب نوع الإقامة", es: "Buscar por tipo de alojamiento" },
    "unique_stays_title": { fr: "Séjournez dans nos hébergements uniques", en: "Stay in our unique accommodations", ar: "أقم في أماكن إقامتنا الفريدة", es: "Quédate en nuestros alojamientos únicos" },
    "unique_stays_desc": { fr: "Une sélection rigoureuse des établissements les mieux notés sur StayFloow.com", en: "A careful selection of top-rated properties on StayFloow.com", ar: "مجموعة مختارة بعناية من أفضل العقارات تقييمًا", es: "Una cuidada selección de las propiedades mejor valoradas" },
    "from_price": { fr: "À partir de", en: "Starting from", ar: "ابتداءً من", es: "Desde" },
    "recently_viewed": { fr: "Consultés récemment", en: "Recently viewed", ar: "تمت مشاهدتها مؤخراً", es: "Vistos recientemente" },
    "inspired_by_visit": { fr: "Inspirés par votre visite", en: "Inspired by your visit", ar: "مستوحى من زيارتك", es: "Inspirado por tu visita" },
};

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  getLocaleDetails: (loc?: Locale) => { name: string; flag: string; dir: 'ltr' | 'rtl' };
  availableLocales: Locale[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<Locale>('fr');

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = localeDetails[locale].dir;
  }, [locale]);

  const t = useCallback((key: string): string => {
    return translations[key]?.[locale] || key;
  }, [locale]);

  const getLocaleDetails = (loc?: Locale) => {
    return localeDetails[loc || locale];
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, getLocaleDetails, availableLocales: Object.keys(localeDetails) as Locale[] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
