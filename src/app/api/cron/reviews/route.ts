import { NextResponse } from 'next/server';
import { adminDb } from '@/firebase/admin';
import { sendReviewInvitationEmail } from '@/lib/mail';
import { randomUUID } from 'crypto';

export const dynamic = 'force-dynamic';

/**
 * API Cron pour envoyer les invitations d'avis clients.
 * Déclenchement conseillé : Tous les jours à 09:00 AM.
 */
export async function GET(req: Request) {
  try {
    // 1. Vérification de sécurité (Header Secret)
    const authHeader = req.headers.get('Authorization');
    const cronSecret = process.env.CRON_SECRET || 'STAYFLOOW_CRON_SECRET_2026';
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // 2. Calculer la date d'hier (Checkout + 1)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    const yesterdayStr = yesterday.toISOString().split('T')[0]; // Format YYYY-MM-DD
    
    console.log(`[CRON REVIEWS] Recherche des checkouts du : ${yesterdayStr}`);

    // 3. Rechercher les réservations terminées hier
    // Note: On suppose que endDate est stocké au format ISO string YYYY-MM-DD...
    const bookingsQuery = adminDb.collection('bookings')
      .where('status', '==', 'approved')
      .where('reviewEmailSent', '!=', true);
      
    const snapshot = await bookingsQuery.get();
    
    if (snapshot.empty) {
      return NextResponse.json({ message: 'Aucune réservation à traiter' });
    }

    const results = [];

    for (const doc of snapshot.docs) {
      const booking = doc.data();
      const bookingEndDate = new Date(booking.endDate);
      bookingEndDate.setHours(0,0,0,0);
      
      // On vérifie si le checkout était bien hier
      if (bookingEndDate.getTime() === yesterday.getTime()) {
        const token = randomUUID();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30); // 30 jours de validité

        // Créer le token dans Firestore
        await adminDb.collection('review_tokens').doc(token).set({
          bookingId: doc.id,
          listingId: booking.listingId,
          customerEmail: booking.customerEmail,
          customerName: booking.customerName || 'Client StayFloow',
          itemName: booking.itemName,
          startDate: booking.startDate,
          endDate: booking.endDate,
          used: false,
          expiresAt: expiresAt.toISOString(),
          createdAt: new Date().toISOString()
        });

        // Envoyer l'email
        await sendReviewInvitationEmail({
          customerName: booking.customerName || 'Client',
          customerEmail: booking.customerEmail,
          itemName: booking.itemName,
          startDate: booking.startDate,
          endDate: booking.endDate,
          token: token
        });

        // Marquer la réservation comme traitée
        await doc.ref.update({
          reviewEmailSent: true,
          reviewTokenId: token
        });

        results.push({ bookingId: doc.id, status: 'sent' });
      }
    }

    return NextResponse.json({ 
      success: true, 
      processed: results.length,
      details: results
    });

  } catch (error: any) {
    console.error('[CRON REVIEWS ERROR]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
