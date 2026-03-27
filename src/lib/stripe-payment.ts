
'use client';

import { collection, addDoc, onSnapshot, Firestore } from 'firebase/firestore';

/**
 * @fileOverview Utilitaire pour créer une session de paiement Stripe.
 * L'extension Firebase surveille la collection 'checkout_sessions' et génère l'URL de paiement.
 */

export async function createStripeCheckout(
  db: Firestore, 
  userId: string, 
  amount: number, // Montant total (ex: 120.00)
  currency: string, // Devise (ex: "EUR")
  productName: string, // Nom affiché sur Stripe
  successUrl: string, 
  cancelUrl: string
) {
  try {
    const sessionsRef = collection(db, 'customers', userId, 'checkout_sessions');
    
    // 1. Ajouter un document pour demander une session dynamiquement
    const docRef = await addDoc(sessionsRef, {
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: productName,
            },
            unit_amount: Math.round(amount * 100), // Stripe attend des centimes
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      collect_shipping_address: false,
    });

    // 2. Écouter le document jusqu'à ce que l'extension Stripe ajoute l'URL
    return new Promise<string | null>((resolve, reject) => {
      // Sécurité : Timeout après 10 secondes si l'extension ne répond pas
      const timeoutId = setTimeout(() => {
        unsubscribe();
        resolve(null); 
      }, 10000);

      const unsubscribe = onSnapshot(docRef, (snap) => {
        const data = snap.data();
        if (!data) return;

        const { error, url } = data as any;
        
        if (error) {
          clearTimeout(timeoutId);
          unsubscribe();
          reject(new Error(`Stripe Error: ${error.message}`));
        }
        
        if (url) {
          clearTimeout(timeoutId);
          unsubscribe();
          resolve(url); 
        }
      });
    });
  } catch (err) {
    console.error("Erreur lors de la création de la session Stripe", err);
    throw err;
  }
}
