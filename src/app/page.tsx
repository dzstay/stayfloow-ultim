import { HomeClient } from '@/components/home-client';

/**
 * Page racine de StayFloow.com.
 * Implémentée en tant que Server Component pour un routage et un SEO optimisés.
 * Les interactions sont gérées par le composant client HomeClient.
 */
export default function Home() {
  return <HomeClient />;
}
