import { Metadata } from 'next';
import { getAdminDb } from '@/firebase/admin';

type Props = {
  params: Promise<{ id: string }>
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  let title = "Circuit Touristique | StayFloow";
  let description = "Découvrez des circuits inoubliables en Algérie et en Égypte sur StayFloow au meilleur prix.";

  try {
    const db = getAdminDb();
    if (db) {
      const docSnap = await db.collection('listings').doc(id).get();
      if (docSnap.exists) {
        const data = docSnap.data();
        const name = data?.details?.name || data?.name || "Circuit";
        const location = data?.location?.address || data?.location || "";
        const shortLocation = location && typeof location === 'string' ? location.split(',')[0] : "";
        title = `Circuit ${name} ${shortLocation ? `- ${shortLocation} ` : ''}| StayFloow`;
        description = data?.details?.description?.substring(0, 160) || description;
      }
    }
  } catch (e) {
    console.error("Erreur SEO Metadata Circuit:", e);
  }

  return { title, description };
}

export default function CircuitLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
