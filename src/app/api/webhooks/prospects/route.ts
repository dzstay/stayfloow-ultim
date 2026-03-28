import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    const secret = process.env.STAYFLOOW_PROSPECTS_SECRET;

    // Si on a configuré un secret et que le header ne correspond pas
    if (secret && authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const payload = await req.json();

    const { name, email, phone, location, sourcePlatform, propertyLink } = payload;

    if (!name || (!email && !phone)) {
      return NextResponse.json({ error: 'Nom et (Email ou Téléphone) requis' }, { status: 400 });
    }

    // Dynamic import to avoid build-time Firebase initialization issues
    const { collection, addDoc } = await import('firebase/firestore');
    const { initializeFirebase } = await import('@/firebase');
    
    const { firestore } = initializeFirebase();
    if (!firestore) throw new Error("Firestore introuvable");

    const prospectsRef = collection(firestore, 'prospects');
    
    const newProspect = {
      name,
      email: email || '',
      phone: phone || '',
      location: location || '',
      sourcePlatform: sourcePlatform || 'Inconnu',
      propertyLink: propertyLink || '',
      status: 'Nouveau', // Nouveau, Contacté, Converti, Refusé
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await addDoc(prospectsRef, newProspect);

    return NextResponse.json({ success: true, id: docRef.id, prospect: newProspect }, { status: 201 });

  } catch (error: any) {
    console.error('Erreur Webhook Prospects:', error);
    return NextResponse.json({ error: 'Erreur interne', details: error.message }, { status: 500 });
  }
}
