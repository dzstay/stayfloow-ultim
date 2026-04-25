
import { cookies } from 'next/headers';
import { translations, Locale } from './translations';

/**
 * Récupère la locale actuelle côté serveur.
 */
export async function getLocaleServer(): Promise<Locale> {
  const cookieStore = await cookies();
  const locale = cookieStore.get('stayfloow_locale')?.value as Locale;
  
  if (locale && ['fr', 'en', 'ar', 'es'].includes(locale)) {
    return locale;
  }
  
  return 'fr'; // Par défaut
}

/**
 * Fonction de traduction côté serveur.
 */
export async function getTranslationServer() {
  const locale = await getLocaleServer();
  
  return (key: string): string => {
    return translations[key]?.[locale] || key;
  };
}
