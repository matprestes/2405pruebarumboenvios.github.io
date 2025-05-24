
'use server';
import { suggestDeliveryOptions as suggestDeliveryOptionsFlowFn, type SuggestDeliveryOptionsInput, type SuggestDeliveryOptionsOutput } from '@/ai/flows/suggest-delivery-options';

export async function getAISuggestions(input: SuggestDeliveryOptionsInput): Promise<SuggestDeliveryOptionsOutput | { error: string }> {
  try {
    const result = await suggestDeliveryOptionsFlowFn(input);
    return result;
  } catch (error) {
    console.error("Error getting AI suggestions:", error);
    if (error instanceof Error) {
        return { error: `Failed to get AI suggestions: ${error.message}` };
    }
    return { error: "An unknown error occurred while getting AI suggestions." };
  }
}
