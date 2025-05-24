
-- Ensure pgcrypto is available for uuid_generate_v4, or use extensions.uuid_generate_v4() if uuid-ossp is preferred and enabled.
-- create extension if not exists "pgcrypto" with schema "public";
create extension if not exists "uuid-ossp" with schema "extensions";

-- Clients Table
create table public.clients (
  id uuid primary key default extensions.uuid_generate_v4(),
  name text not null,
  email text not null unique,
  phone text,
  address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
comment on table public.clients is 'Stores client information.';

-- Companies Table
create table public.companies (
  id uuid primary key default extensions.uuid_generate_v4(),
  name text not null,
  contact_person text,
  email text not null unique,
  phone text,
  address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
comment on table public.companies is 'Stores company information, potentially B2B clients or partners.';

-- Couriers Table
create table public.couriers (
  id uuid primary key default extensions.uuid_generate_v4(),
  name text not null,
  vehicle_type text check (vehicle_type in ('Motorcycle', 'Car', 'Van', 'Bicycle', 'Truck')),
  plate_number text,
  phone text,
  status text check (status in ('Available', 'On Delivery', 'Offline')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
comment on table public.couriers is 'Stores courier information.';

-- Shipments Table
create table public.shipments (
  id uuid primary key default extensions.uuid_generate_v4(),
  origin text not null,
  destination text not null,
  client_id uuid references public.clients(id) on delete set null,
  courier_id uuid references public.couriers(id) on delete set null,
  status text check (status in ('Pending', 'In Transit', 'Delivered', 'Cancelled', 'Issue')) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  estimated_delivery_date timestamp with time zone,
  package_details jsonb, -- { "weightKg": number, "dimensionsCm": string, "description": string, "type": string }
  cost numeric(10, 2)
);
comment on table public.shipments is 'Stores shipment information.';

-- Enable RLS (Row Level Security) for all tables
alter table public.clients enable row level security;
alter table public.companies enable row level security;
alter table public.couriers enable row level security;
alter table public.shipments enable row level security;

-- Basic RLS Policies (adjust based on your auth requirements)
-- For now, allow public read and authenticated users to manage their own data (assuming an auth setup)
-- These are illustrative and need proper auth integration (e.g., checking auth.uid())

-- Clients Policies
create policy "Allow public read access to clients" on public.clients for select using (true);
create policy "Allow authenticated users to insert clients" on public.clients for insert to authenticated with check (true);
create policy "Allow authenticated users to update clients" on public.clients for update to authenticated using (true) with check (true);
create policy "Allow authenticated users to delete clients" on public.clients for delete to authenticated using (true);

-- Companies Policies
create policy "Allow public read access to companies" on public.companies for select using (true);
create policy "Allow authenticated users to insert companies" on public.companies for insert to authenticated with check (true);
create policy "Allow authenticated users to update companies" on public.companies for update to authenticated using (true) with check (true);
create policy "Allow authenticated users to delete companies" on public.companies for delete to authenticated using (true);

-- Couriers Policies
create policy "Allow public read access to couriers" on public.couriers for select using (true);
create policy "Allow authenticated users to insert couriers" on public.couriers for insert to authenticated with check (true);
create policy "Allow authenticated users to update couriers" on public.couriers for update to authenticated using (true) with check (true);
create policy "Allow authenticated users to delete couriers" on public.couriers for delete to authenticated using (true);

-- Shipments Policies
create policy "Allow public read access to shipments" on public.shipments for select using (true);
create policy "Allow authenticated users to insert shipments" on public.shipments for insert to authenticated with check (true);
create policy "Allow authenticated users to update shipments" on public.shipments for update to authenticated using (true) with check (true);
create policy "Allow authenticated users to delete shipments" on public.shipments for delete to authenticated using (true);
