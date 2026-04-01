import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { adminDb } from '@/firebase/admin';
import { userBookings } from '@/lib/user-bookings-data';

export const getBookingInfo = ai.defineTool(
  {
    name: 'getBookingInfo',
    description: 'Récupère les détails d\'une réservation StayFloow (statut, dates, montant) en utilisant son identifiant STxxxx.',
    inputSchema: z.object({
      bookingId: z.string().describe('L\'identifiant de la réservation (ex: ST2024-8451 ou ST8451).'),
    }),
    outputSchema: z.object({
      found: z.boolean(),
      details: z.any().optional(),
      error: z.string().optional(),
    }),
  },
  async (input) => {
    const { bookingId } = input;
    const normalizedId = bookingId.toUpperCase();

    try {
      // 1. Chercher dans les données mockées d'abord (utile pour la démo/dev)
      const mockBooking = userBookings.find(b => 
        b.id.toUpperCase() === normalizedId || 
        b.id.toUpperCase().includes(normalizedId)
      );

      if (mockBooking) {
        return { found: true, details: mockBooking };
      }

      // 2. Chercher dans Firestore (Réel)
      const bookingDoc = await adminDb.collection('bookings').doc(normalizedId).get();
      if (bookingDoc.exists) {
        return { found: true, details: bookingDoc.data() };
      }

      // 3. Recherche par query si l'ID est partiel
      const querySnapshot = await adminDb.collection('bookings')
        .where('orderId', '==', normalizedId)
        .limit(1)
        .get();

      if (!querySnapshot.empty) {
        return { found: true, details: querySnapshot.docs[0].data() };
      }

      return { found: false, error: "Réservation non trouvée dans le système." };
    } catch (error) {
      console.error('Error fetching booking:', error);
      return { found: false, error: "Erreur technique lors de la recherche." };
    }
  }
);
