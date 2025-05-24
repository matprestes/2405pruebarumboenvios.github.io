
'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { companySchema, type CompanyFormData } from '@/lib/schemas';
import type { Company } from '@/lib/types';

export async function getCompanies(): Promise<Company[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from('companies').select('*').order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching companies:', error);
    return [];
  }
  return data || [];
}

export async function createCompany(formData: CompanyFormData) {
  const supabase = createSupabaseServerClient();
  const validatedFields = companySchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      error: 'Invalid fields.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const { id, created_at, ...insertData } = validatedFields.data;

  const { data, error } = await supabase.from('companies').insert(insertData).select().single();

  if (error) {
    console.error('Error creating company:', error);
    return { error: `Failed to create company: ${error.message}` };
  }

  revalidatePath('/companies');
  return { data };
}

export async function updateCompany(id: string, formData: CompanyFormData) {
  const supabase = createSupabaseServerClient();
  const validatedFields = companySchema.safeParse(formData);

  if (!validatedFields.success) {
     return {
      error: 'Invalid fields.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const { created_at, id: validatedId, ...updateData } = validatedFields.data;
  
  const { data, error } = await supabase.from('companies').update(updateData).eq('id', id).select().single();

  if (error) {
    console.error('Error updating company:', error);
    return { error: `Failed to update company: ${error.message}` };
  }

  revalidatePath('/companies');
  return { data };
}

export async function deleteCompany(id: string) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from('companies').delete().eq('id', id);

  if (error) {
    console.error('Error deleting company:', error);
    return { error: `Failed to delete company: ${error.message}` };
  }

  revalidatePath('/companies');
  return { success: true };
}
