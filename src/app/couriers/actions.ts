
'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { courierSchema, type CourierFormData } from '@/lib/schemas';
import type { Courier } from '@/lib/types';

export async function getCouriers(): Promise<Courier[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from('couriers').select('*').order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching couriers:', error);
    return [];
  }
  return data || [];
}

export async function createCourier(formData: CourierFormData) {
  const supabase = createSupabaseServerClient();
  const validatedFields = courierSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      error: 'Invalid fields.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const { id, created_at, ...insertData } = validatedFields.data;

  const { data, error } = await supabase.from('couriers').insert(insertData).select().single();

  if (error) {
    console.error('Error creating courier:', error);
    return { error: `Failed to create courier: ${error.message}` };
  }

  revalidatePath('/couriers');
  return { data };
}

export async function updateCourier(id: string, formData: CourierFormData) {
  const supabase = createSupabaseServerClient();
  const validatedFields = courierSchema.safeParse(formData);

  if (!validatedFields.success) {
     return {
      error: 'Invalid fields.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const { created_at, id: validatedId, ...updateData } = validatedFields.data;

  const { data, error } = await supabase.from('couriers').update(updateData).eq('id', id).select().single();

  if (error) {
    console.error('Error updating courier:', error);
    return { error: `Failed to update courier: ${error.message}` };
  }

  revalidatePath('/couriers');
  return { data };
}

export async function deleteCourier(id: string) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from('couriers').delete().eq('id', id);

  if (error) {
    console.error('Error deleting courier:', error);
    return { error: `Failed to delete courier: ${error.message}` };
  }

  revalidatePath('/couriers');
  return { success: true };
}
