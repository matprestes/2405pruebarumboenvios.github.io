
import { z } from 'zod';

// Base schema for common fields like ID and created_at
const baseSchema = z.object({
  id: z.string().uuid().optional(),
  created_at: z.string().datetime().optional(),
});

// Client Schema
export const clientSchema = baseSchema.extend({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  email: z.string().email({ message: "Email inválido." }),
  phone: z.string().min(7, { message: "El teléfono debe tener al menos 7 caracteres." }).nullable().optional(),
  address: z.string().min(5, { message: "La dirección debe tener al menos 5 caracteres." }).nullable().optional(),
});
export type ClientFormData = z.infer<typeof clientSchema>;

// Company Schema
export const companySchema = baseSchema.extend({
  name: z.string().min(2, { message: "El nombre de la empresa debe tener al menos 2 caracteres." }),
  contact_person: z.string().min(2, { message: "El nombre del contacto debe tener al menos 2 caracteres." }).nullable().optional(),
  email: z.string().email({ message: "Email inválido." }),
  phone: z.string().min(7, { message: "El teléfono debe tener al menos 7 caracteres." }).nullable().optional(),
  address: z.string().min(5, { message: "La dirección debe tener al menos 5 caracteres." }).nullable().optional(),
});
export type CompanyFormData = z.infer<typeof companySchema>;

// Courier Schema
export const courierSchema = baseSchema.extend({
  name: z.string().min(2, { message: "El nombre del repartidor debe tener al menos 2 caracteres." }),
  vehicle_type: z.enum(['Motorcycle', 'Car', 'Van', 'Bicycle', 'Truck'], { required_error: "El tipo de vehículo es requerido."}).nullable().optional(),
  plate_number: z.string().min(3, { message: "La matrícula debe tener al menos 3 caracteres." }).nullable().optional(),
  phone: z.string().min(7, { message: "El teléfono debe tener al menos 7 caracteres." }).nullable().optional(),
  status: z.enum(['Available', 'On Delivery', 'Offline'], { required_error: "El estado es requerido."}).nullable().optional(),
});
export type CourierFormData = z.infer<typeof courierSchema>;

// PackageDetails Schema (for Shipment)
export const packageDetailsSchema = z.object({
  weightKg: z.number().positive({ message: "El peso debe ser un número positivo." }),
  dimensionsCm: z.string().min(3, { message: "Las dimensiones son requeridas." }), // e.g., "30x20x10"
  description: z.string().min(3, { message: "La descripción es requerida." }),
  type: z.enum(['Envelope', 'Small Box', 'Medium Box', 'Large Box', 'Custom'], { required_error: "El tipo de paquete es requerido."}),
});

// Shipment Schema
export const shipmentSchema = baseSchema.extend({
  origin: z.string().min(5, { message: "El origen debe tener al menos 5 caracteres." }),
  destination: z.string().min(5, { message: "El destino debe tener al menos 5 caracteres." }),
  client_id: z.string().uuid({ message: "Debe seleccionar un cliente válido." }).nullable().optional(),
  courier_id: z.string().uuid({ message: "Debe seleccionar un repartidor válido." }).nullable().optional(),
  status: z.enum(['Pending', 'In Transit', 'Delivered', 'Cancelled', 'Issue'], { required_error: "El estado del envío es requerido."}),
  created_at: z.string().datetime().optional(), // Should be set by DB
  estimated_delivery_date: z.string().datetime().nullable().optional(),
  package_details: packageDetailsSchema.nullable().optional(),
  cost: z.number().nonnegative({ message: "El costo no puede ser negativo." }).nullable().optional(),
});
export type ShipmentFormData = z.infer<typeof shipmentSchema>;

// Quotation Schema (from existing form)
export const quotationFormSchema = z.object({
  origin: z.string().min(5, { message: "El origen debe tener al menos 5 caracteres." }),
  destination: z.string().min(5, { message: "El destino debe tener al menos 5 caracteres." }),
  packageType: z.enum(['Envelope', 'Small Box', 'Medium Box', 'Large Box', 'Custom'], { required_error: "El tipo de paquete es requerido."}),
  weightKg: z.number().positive({ message: "El peso debe ser un número positivo." }),
  serviceType: z.enum(['standard', 'express', 'urgent'], { required_error: "El tipo de servicio es requerido."}),
});
export type QuotationFormData = z.infer<typeof quotationFormSchema>;

// AI Suggestions Input Schema (from existing flow)
export const suggestDeliveryOptionsInputSchema = z.object({
  packageSize: z.enum(['small', 'medium', 'large'], { required_error: "El tamaño del paquete es requerido." }),
  deliveryUrgency: z.enum(['standard', 'express', 'urgent'], { required_error: "La urgencia de entrega es requerida." }),
  deliveryLocation: z.string().min(5, { message: "La ubicación de entrega debe tener al menos 5 caracteres." }),
});
export type AISuggestionsFormData = z.infer<typeof suggestDeliveryOptionsInputSchema>;

