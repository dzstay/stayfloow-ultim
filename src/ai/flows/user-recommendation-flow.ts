'use server';
/**
 * @fileOverview A Genkit flow for tailoring user recommendations based on preferences and history.
 *
 * - tailorRecommendationsViaUI - A function that handles the personalized recommendation process.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const RecommendationInputSchema = z.object({
  userPreferences: z.string().describe('User selected preferences.'),
  recommendationToolEnabled: z.boolean().describe('Whether the recommendation engine is active.'),
  pastBookings: z.string().describe('History of past bookings.'),
  travelerProfiles: z.string().describe('Type of traveler profile.'),
});

export type RecommendationInput = z.infer<typeof RecommendationInputSchema>;

const RecommendationOutputSchema = z.object({
  accommodations: z.string().describe('The personalized suggestions generated.'),
});

export type RecommendationOutput = z.infer<typeof RecommendationOutputSchema>;

export async function tailorRecommendationsViaUI(input: RecommendationInput): Promise<RecommendationOutput> {
  return tailorRecommendationsFlow(input);
}

const tailorRecommendationsFlow = ai.defineFlow(
  {
    name: 'tailorRecommendationsFlow',
    inputSchema: RecommendationInputSchema,
    outputSchema: RecommendationOutputSchema,
  },
  async (input) => {
    console.log("DEBUG: Running user-recommendation-flow for StayFloow.com");
    
    // Simule un délai pour imiter un traitement IA
    await new Promise((resolve) => setTimeout(resolve, 1200));

    if (!input.recommendationToolEnabled) {
      return {
        accommodations: "Les recommandations personnalisées sont désactivées. Activez-les pour obtenir des suggestions adaptées sur StayFloow.com.",
      };
    }

    const generatedText = `
Préférences détectées : ${input.userPreferences}

Profil du voyageur : ${input.travelerProfiles}

Historique : ${input.pastBookings}

✨ Suggestions personnalisées StayFloow.com :
- Appartement moderne avec vue panoramique
- Hôtel familial proche des restaurants et activités
- Bungalow calme avec terrasse privée
    `;

    return {
      accommodations: generatedText.trim(),
    };
  }
);
