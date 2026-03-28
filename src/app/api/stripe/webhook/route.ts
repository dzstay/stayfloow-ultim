import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { sendBookingConfirmationEmail } from '@/lib/mail';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia' // Matching the app's version limit
});

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Signature manquant' }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.warn("WEBHOOK STRIPE : STRIPE_WEBHOOK_SECRET n'est pas configuré. Veuillez l'ajouter dans l'environnement !");
    return NextResponse.json({ error: 'Webhook secret non configuré' }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;

    if (!bookingId) {
      console.warn('Webhook Stripe: Pas de bookingId dans les metadata.');
      return NextResponse.json({ result: 'Ignored, no bookingId' });
    }

    try {
      const { firestore } = initializeFirebase();
      if (!firestore) throw new Error("Erreur Firebase Firestore introuvable");

      const bookingRef = doc(firestore, 'bookings', bookingId);
      const bookingDoc = await getDoc(bookingRef);

      if (!bookingDoc.exists()) {
        console.error(`Booking non trouvé: ${bookingId}`);
        return NextResponse.json({ error: 'Booking non trouvé' }, { status: 404 });
      }

      const booking = bookingDoc.data();
      
      // Mettre à jour le statut
      await updateDoc(bookingRef, {
        status: 'approved',
        paymentIntentId: session.payment_intent as string | undefined, // Keep trace
        paidAt: new Date().toISOString()
      });

      // Envoyer les emails via sendBookingConfirmationEmail (qui va gérer l'admin et le client)
      await sendBookingConfirmationEmail({
        customerName: booking.customerName || "Client Restreint",
        customerEmail: booking.customerEmail || session.customer_details?.email || "N/A",
        reservationNumber: booking.reservationNumber || bookingId,
        itemName: booking.itemName || "Réservation StayFloow",
        itemType: booking.itemType || "hébergement",
        hostName: "Support StayFloow",
        hostEmail: "stayflow2025@gmail.com",
        hostPhone: "+213 550 00 00 00",
        bookingDetails: {
          startDate: booking.startDate,
          endDate: booking.endDate,
          nights: booking.nights,
          totalPrice: booking.totalPrice,
          depositAmount: booking.depositPaid,
          pickupLocation: booking.pickupLocation
        }
      });

      console.log(`Réservation ${bookingId} payée et confirmée.`);
      
    } catch (error) {
      console.error('Erreur Firebase/Email Webhook:', error);
      return NextResponse.json({ error: 'Erreur interne au webhook' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
