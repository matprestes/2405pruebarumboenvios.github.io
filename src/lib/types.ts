
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Company {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
}

export interface Courier {
  id: string;
  name: string;
  vehicleType: 'Motorcycle' | 'Car' | 'Van' | 'Bicycle' | 'Truck';
  plateNumber: string;
  phone: string;
  status: 'Available' | 'On Delivery' | 'Offline';
}

export interface Shipment {
  id: string;
  origin: string;
  destination: string;
  clientName: string; // Simplified for now, could be clientId referencing Client
  courierName?: string; // Simplified, could be courierId
  status: 'Pending' | 'In Transit' | 'Delivered' | 'Cancelled' | 'Issue';
  creationDate: string; // ISO string
  estimatedDeliveryDate?: string; // ISO string
  packageDetails: {
    weightKg: number;
    dimensionsCm: string; // e.g., '30x20x10'
    description: string;
    type: 'Envelope' | 'Small Box' | 'Medium Box' | 'Large Box' | 'Custom';
  };
  cost?: number;
}

export type PackageSize = 'small' | 'medium' | 'large';
export type DeliveryUrgency = 'standard' | 'express' | 'urgent';

export interface DeliveryOptionSuggestion {
  courierSuggestion: string;
  routeSuggestion: string;
  estimatedDeliveryTime: string;
  estimatedCost: string;
}

export interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  disabled?: boolean;
  external?: boolean;
  label?: string;
  description?: string;
  items?: NavItem[];
}
