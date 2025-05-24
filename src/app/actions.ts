
'use server';
import { suggestDeliveryOptions as suggestDeliveryOptionsFlowFn, type SuggestDeliveryOptionsInput, type SuggestDeliveryOptionsOutput } from '@/ai/flows/suggest-delivery-options';
import { z } from 'zod';

// Define Zod schemas for form validation if needed for other actions.
// For AI suggestions, the input schema is already defined in the flow.

export async function getAISuggestions(input: SuggestDeliveryOptionsInput): Promise<SuggestDeliveryOptionsOutput | { error: string }> {
  try {
    // Validate input if necessary, though Genkit flow already does
    const result = await suggestDeliveryOptionsFlowFn(input);
    return result;
  } catch (error) {
    console.error("Error getting AI suggestions:", error);
    // It's good practice to not expose raw error messages to the client
    // unless they are known to be safe.
    if (error instanceof Error) {
        return { error: `Failed to get AI suggestions: ${error.message}` };
    }
    return { error: "An unknown error occurred while getting AI suggestions." };
  }
}

// Placeholder for other actions
// export async function createClient(data: ClientFormData) { ... }
// export async function updateShipmentStatus(shipmentId: string, status: ShipmentStatus) { ... }
