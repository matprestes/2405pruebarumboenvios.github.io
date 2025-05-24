
'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { shipmentSchema, type ShipmentFormData } from '@/lib/schemas';
import type { ShipmentWithRelations, UpdateShipment } from '@/lib/types';

export async function getShipments(): Promise<ShipmentWithRelations[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('shipments')
    .select(`
      *,
      clients (name),
      couriers (name)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching shipments:', error);
    return [];
  }
  // Explicitly type the data to match ShipmentWithRelations if needed, or adjust component
  return data.map(s => ({
    ...s,
    // Supabase returns related tables as objects, ensure they are null if no relation
    clients: s.clients ? { name: (s.clients as any).name } : null, 
    couriers: s.couriers ? { name: (s.couriers as any).name } : null,
  })) as ShipmentWithRelations[];
}

export async function createShipment(formData: ShipmentFormData) {
  const supabase = createSupabaseServerClient();
  const validatedFields = shipmentSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      error: 'Invalid fields.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const { id, created_at: formCreatedAt, ...insertData } = validatedFields.data;


  // Ensure package_details is stored as JSON if it's an object
  const dbInsertData = {
    ...insertData,
    package_details: insertData.package_details ? JSON.stringify(insertData.package_details) : null,
  };


  const { data, error } = await supabase.from('shipments').insert(dbInsertData).select().single();

  if (error) {
    console.error('Error creating shipment:', error);
    return { error: `Failed to create shipment: ${error.message}` };
  }

  revalidatePath('/shipments');
  return { data };
}

export async function updateShipment(id: string, formData: UpdateShipment) {
  const supabase = createSupabaseServerClient();
  // Assuming UpdateShipment type aligns with what's updatable and validated if necessary
  // For partial updates, ensure schema allows optional fields
  
  const updateData = {
    ...formData,
    package_details: formData.package_details ? JSON.stringify(formData.package_details) : undefined,
  };
  // Remove id and created_at if they are part of formData but not updatable
  delete (updateData as any).id;
  delete (updateData as any).created_at;


  const { data, error } = await supabase.from('shipments').update(updateData).eq('id', id).select().single();

  if (error) {
    console.error('Error updating shipment:', error);
    return { error: `Failed to update shipment: ${error.message}` };
  }

  revalidatePath('/shipments');
  return { data };
}


export async function updateShipmentStatus(id: string, status: ShipmentWithRelations['status']) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('shipments')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating shipment status:', error);
    return { error: `Failed to update shipment status: ${error.message}` };
  }

  revalidatePath('/shipments');
  return { data };
}


export async function deleteShipment(id: string) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from('shipments').delete().eq('id', id);

  if (error) {
    console.error('Error deleting shipment:', error);
    return { error: `Failed to delete shipment: ${error.message}` };
  }

  revalidatePath('/shipments');
  return { success: true };
}
