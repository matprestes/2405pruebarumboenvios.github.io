
import type { NavItem } from '@/lib/types';
import { Home, Truck, Users, Building, UserCheck, DollarSign, Bot, MapPin, FileText } from 'lucide-react';

export const NAV_ITEMS: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    icon: Home,
  },
  {
    title: 'Envíos',
    href: '/shipments',
    icon: Truck,
  },
  {
    title: 'Clientes',
    href: '/clients',
    icon: Users,
  },
  {
    title: 'Empresas',
    href: '/companies',
    icon: Building,
  },
  {
    title: 'Repartidores',
    href: '/couriers',
    icon: UserCheck,
  },
  {
    title: 'Cotización',
    href: '/quotation',
    icon: DollarSign,
  },
  {
    title: 'Sugerencias IA',
    href: '/ai-suggestions',
    icon: Bot,
  },
];

export const GMAPS_LIBRARIES = ["places", "marker", "routes", "geocoding"] as ("places" | "marker" | "routes" | "geocoding")[];
