'use server';
/**
 * @fileOverview Agent de support client IA pour StayFloow.com.
 * Gère les questions sur les réservations (ID commençant par ST) et les services du site.
 *
 * - chatWithSupport - Fonction principale pour dialoguer avec l'IA.
 * - SupportInput - Type d'entrée (message, historique, id réservation).
 * - SupportOutput - Type de sortie (réponse textuelle).
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getBookingInfo } from '@/ai/tools/support-tools';

const SupportInputSchema = z.object({
  message: z.string().describe('Le message actuel de l\'utilisateur.'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string()
  })).optional().describe('L\'historique de la conversation pour le contexte.'),
  reservationId: z.string().optional().describe('L\'identifiant de réservation si connu (ex: ST8451).'),
});

export type SupportInput = z.infer<typeof SupportInputSchema>;

const SupportOutputSchema = z.object({
  response: z.string().describe('La réponse générée par l\'IA.'),
});

export type SupportOutput = z.infer<typeof SupportOutputSchema>;

/**
 * Appelle l'IA de support client StayFloow.
 */
export async function chatWithSupport(input: SupportInput): Promise<SupportOutput> {
  return customerSupportFlow(input);
}

const customerSupportFlow = ai.defineFlow(
  {
    name: 'customerSupportFlow',
    inputSchema: SupportInputSchema,
    outputSchema: SupportOutputSchema,
  },
  async (input) => {
    const { message, history, reservationId } = input;

    const systemPrompt = `Tu es l'Assistant Virtuel Expert de StayFloow.com (Concierge StayFloow).
Ton objectif est de fournir un support exceptionnel, proactif et empathique.

DOMAINES D'EXPERTISE :
1. HÉBERGEMENTS : Hôtels de luxe, Riads authentiques (Maroc), Villas privées et appartements modernes en Algérie, Égypte et Maroc.
2. VÉHICULES : Location de SUV, berlines et voitures économiques avec assurance incluse.
3. CIRCUITS : Expériences guidées exclusives (Sahara, Pyramides de Gizeh, Mer Rouge, etc.).

POLITIQUES CLÉS :
- RÉSERVATIONS : Elles commencent par "ST-" (ex: ST-8451).
- ANNULATION : Gratuite jusqu'à 48h avant le début de la prestation pour la majorité des offres.
- PAIEMENT : Transactions sécurisées via StayFloow Pay (pas de frais cachés).
- CAUTION : Souvent requise pour les véhicules (expliquer clairement selon le modèle).

GESTION DES COMMANDES :
- Si l'utilisateur mentionne une réservation, utilise l'outil "getBookingInfo" pour vérifier son statut réel.
- Si l'ID est fourni partiellement (ex: 8451), essaie de le compléter avec "ST-2024-" ou demande confirmation.
- Si aucun ID n'est fourni mais que l'utilisateur a un problème, DEMANDE POLIMENT le numéro ST.

GESTION DES LITIGES (IMPORTANT) :
1. EMPATHIE : Commence toujours par reconnaître le problème de l'utilisateur ("Je comprends votre frustration...", "Je suis désolé d'apprendre que...").
2. ANALYSE : Utilise getBookingInfo pour voir le statut.
3. RÉSOLUTION : 
    - Explique les étapes (ex: "Je vais remonter ce point au partenaire immédiatement").
    - Si le problème est urgent ou complexe, fournis le lien WhatsApp direct ou l'email support@stayfloow.com.
    - Ne fais pas de promesses de remboursement ferme que tu ne peux pas garantir techniquement.

TON & STYLE :
- Langue : Réponds dans la langue utilisée par l'utilisateur (Français, Arabe ou Anglais).
- Style : Professionnel, chaleureux, rassurant. Évite les réponses trop longues.
- Clôture : Offre toujours une aide supplémentaire.

CONTEXTE ACTUEL :
- ID Réservation détecté en session : ${reservationId || 'Aucun'}
- Date actuelle : ${new Date().toLocaleDateString('fr-FR')}

Utilise tes outils si nécessaire pour donner une réponse précise.`;

    const { output } = await ai.generate({
      system: systemPrompt,
      messages: history?.map(h => ({
        role: h.role,
        content: [{ text: h.content }]
      })) || [],
      prompt: message,
      tools: [getBookingInfo],
    });

    return { response: output?.text || "Je suis désolé, je n'ai pas pu traiter votre demande. Veuillez me donner plus de détails." };
  }
);

