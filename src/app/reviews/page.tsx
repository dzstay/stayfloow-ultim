'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function ReviewsIndex() {
  const router = useRouter();

  useEffect(() => {
    // Rediriger vers l'accueil car on a besoin d'un token pour voir un avis
    const timer = setTimeout(() => {
      router.push('/');
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <Loader2 className="h-10 w-10 animate-spin text-[#00C896] mb-4" />
      <h1 className="text-2xl font-black text-slate-900 mb-2">Section Évaluations StayFloow</h1>
      <p className="text-slate-500">Veuillez utiliser le lien reçu dans votre email d'invitation.</p>
    </div>
  );
}
