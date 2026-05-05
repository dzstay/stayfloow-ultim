import { Metadata } from 'next';
import { getAdminDb } from '@/firebase/admin';

type Props = {
  params: Promise<{ id: string }>
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  let title = "Location de Voiture | StayFloow";
  let description = "Louez votre véhicule idéal en Algérie et en Égypte sur StayFloow au meilleur prix.";

  try {
    const db = getAdminDb();
    if (db) {
      const docSnap = await db.collection('listings').doc(id).get();
      if (docSnap.exists) {
        const data = docSnap.data();
        const brand = data?.details?.brand || "Voiture";
        const model = data?.details?.model || "";
        const location = data?.location?.address || data?.location || "";
        const shortLocation = location && typeof location === 'string' ? location.split(',')[0] : "";
        title = `Location ${brand} ${model} ${shortLocation ? `- ${shortLocation} ` : ''}| StayFloow`;
        description = data?.details?.description?.substring(0, 160) || description;
      }
    }
  } catch (e) {
    console.error("Erreur SEO Metadata Car:", e);
  }

  return { title, description };
}

export default function CarLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
