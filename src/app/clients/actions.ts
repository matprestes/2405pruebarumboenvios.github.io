
'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { clientSchema, type ClientFormData } from '@/lib/schemas';
import type { Client } from '@/lib/types';

export async function getClients(): Promise<Client[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching clients:', error);
    return [];
  }
  return data || [];
}

export async function createClient(formData: ClientFormData) {
  const supabase = createSupabaseServerClient();
  const validatedFields = clientSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      error: 'Invalid fields.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { id, created_at, ...insertData } = validatedFields.data;


  const { data, error } = await supabase.from('clients').insert(insertData).select().single();

  if (error) {
    console.error('Error creating client:', error);
    return { error: `Failed to create client: ${error.message}` };
  }

  revalidatePath('/clients');
  return { data };
}

export async function updateClient(id: string, formData: ClientFormData) {
  const supabase = createSupabaseServerClient();
   const validatedFields = clientSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      error: 'Invalid fields.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const { created_at, id: validatedId, ...updateData } = validatedFields.data;

  const { data, error } = await supabase.from('clients').update(updateData).eq('id', id).select().single();

  if (error) {
    console.error('Error updating client:', error);
    return { error: `Failed to update client: ${error.message}` };
  }

  revalidatePath('/clients');
  return { data };
}

export async function deleteClient(id: string) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from('clients').delete().eq('id', id);

  if (error) {
    console.error('Error deleting client:', error);
    return { error: `Failed to delete client: ${error.message}` };
  }

  revalidatePath('/clients');
  return { success: true };
}
