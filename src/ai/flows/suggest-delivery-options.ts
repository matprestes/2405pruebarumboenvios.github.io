// use server'

/**
 * @fileOverview AI agent to suggest optimal delivery options.
 *
 * - suggestDeliveryOptions - A function that suggests delivery options based on package size, delivery urgency, and location.
 * - SuggestDeliveryOptionsInput - The input type for the suggestDeliveryOptions function.
 * - SuggestDeliveryOptionsOutput - The return type for the suggestDeliveryOptions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestDeliveryOptionsInputSchema = z.object({
  packageSize: z
    .string()
    .describe('The size of the package (small, medium, large).'),
  deliveryUrgency: z
    .string()
    .describe('The delivery urgency (standard, express, urgent).'),
  deliveryLocation: z
    .string()
    .describe('The delivery location (address).'),
});
export type SuggestDeliveryOptionsInput = z.infer<
  typeof SuggestDeliveryOptionsInputSchema
>;

const SuggestDeliveryOptionsOutputSchema = z.object({
  courierSuggestion: z
    .string()
    .describe('The suggested courier for the delivery.'),
  routeSuggestion: z.string().describe('The suggested route for the delivery.'),
  estimatedDeliveryTime: z
    .string()
    .describe('The estimated delivery time.'),
  estimatedCost: z.string().describe('The estimated delivery cost.'),
});
export type SuggestDeliveryOptionsOutput = z.infer<
  typeof SuggestDeliveryOptionsOutputSchema
>;

export async function suggestDeliveryOptions(
  input: SuggestDeliveryOptionsInput
): Promise<SuggestDeliveryOptionsOutput> {
  return suggestDeliveryOptionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestDeliveryOptionsPrompt',
  input: {schema: SuggestDeliveryOptionsInputSchema},
  output: {schema: SuggestDeliveryOptionsOutputSchema},
  prompt: `You are a logistics expert. Based on the package size, delivery urgency, and delivery location, suggest the optimal delivery options.

Package Size: {{{packageSize}}}
Delivery Urgency: {{{deliveryUrgency}}}
Delivery Location: {{{deliveryLocation}}}

Consider various factors such as cost, speed, and reliability to provide the best recommendations.

Output in the format:
Courier Suggestion: [Courier Name]
Route Suggestion: [Optimal Route]
Estimated Delivery Time: [Time]
Estimated Cost: [Cost]`,
});

const suggestDeliveryOptionsFlow = ai.defineFlow(
  {
    name: 'suggestDeliveryOptionsFlow',
    inputSchema: SuggestDeliveryOptionsInputSchema,
    outputSchema: SuggestDeliveryOptionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
