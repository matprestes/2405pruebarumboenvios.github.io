
-- Script de Migración Inicial Optimizado para RumbosEnvios

BEGIN;

-- Deshabilitar RLS temporalmente para modificaciones de esquema si es necesario
-- ALTER TABLE public.shipments DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.couriers DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.clients DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.companies DISABLE ROW LEVEL SECURITY;

-- 0. Eliminar tipos y tablas existentes en orden inverso de dependencia (si existen)
DROP TABLE IF EXISTS public.shipments CASCADE;
DROP TABLE IF EXISTS public.couriers CASCADE;
DROP TABLE IF EXISTS public.clients CASCADE;
DROP TABLE IF EXISTS public.companies CASCADE;

DROP TYPE IF EXISTS public.courier_status_enum CASCADE;
DROP TYPE IF EXISTS public.shipment_status_enum CASCADE;
DROP TYPE IF EXISTS public.vehicle_type_enum CASCADE;
-- package_type_enum no se crea como SQL enum ya que se usa dentro de JSONB

DROP FUNCTION IF EXISTS public.update_updated_at_column();

-- 1. Crear Tipos ENUM
CREATE TYPE public.courier_status_enum AS ENUM (
    'Available',
    'On Delivery',
    'Offline'
);
COMMENT ON TYPE public.courier_status_enum IS 'Posibles estados de un repartidor.';

CREATE TYPE public.shipment_status_enum AS ENUM (
    'Pending',
    'In Transit',
    'Delivered',
    'Cancelled',
    'Issue'
);
COMMENT ON TYPE public.shipment_status_enum IS 'Posibles estados de un envío.';

CREATE TYPE public.vehicle_type_enum AS ENUM (
    'Motorcycle',
    'Car',
    'Van',
    'Bicycle',
    'Truck'
);
COMMENT ON TYPE public.vehicle_type_enum IS 'Tipos de vehículos para repartidores.';


-- 2. Crear Función para actualizar `updated_at`
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';
COMMENT ON FUNCTION public.update_updated_at_column() IS 'Función de trigger para actualizar automáticamente la columna updated_at.';


-- 3. Crear Tabla `clients`
CREATE TABLE public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.clients IS 'Tabla para almacenar información de los clientes.';
COMMENT ON COLUMN public.clients.id IS 'Identificador único del cliente.';
COMMENT ON COLUMN public.clients.name IS 'Nombre completo del cliente.';
COMMENT ON COLUMN public.clients.email IS 'Dirección de correo electrónico del cliente (única).';
COMMENT ON COLUMN public.clients.phone IS 'Número de teléfono del cliente.';
COMMENT ON COLUMN public.clients.address IS 'Dirección física del cliente.';
COMMENT ON COLUMN public.clients.created_at IS 'Timestamp de creación del registro.';
COMMENT ON COLUMN public.clients.updated_at IS 'Timestamp de la última actualización del registro.';

-- Trigger para `clients.updated_at`
CREATE TRIGGER clients_updated_at_trigger
BEFORE UPDATE ON public.clients
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();


-- 4. Crear Tabla `companies` (similar a clients, pero para empresas)
CREATE TABLE public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    contact_person TEXT,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.companies IS 'Tabla para almacenar información de las empresas cliente.';
COMMENT ON COLUMN public.companies.id IS 'Identificador único de la empresa.';
COMMENT ON COLUMN public.companies.name IS 'Nombre de la empresa.';
COMMENT ON COLUMN public.companies.contact_person IS 'Nombre de la persona de contacto en la empresa.';
COMMENT ON COLUMN public.companies.email IS 'Dirección de correo electrónico de la empresa (única).';
COMMENT ON COLUMN public.companies.phone IS 'Número de teléfono de la empresa.';
COMMENT ON COLUMN public.companies.address IS 'Dirección física de la empresa.';
COMMENT ON COLUMN public.companies.created_at IS 'Timestamp de creación del registro.';
COMMENT ON COLUMN public.companies.updated_at IS 'Timestamp de la última actualización del registro.';

-- Trigger para `companies.updated_at`
CREATE TRIGGER companies_updated_at_trigger
BEFORE UPDATE ON public.companies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();


-- 5. Crear Tabla `couriers`
CREATE TABLE public.couriers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    vehicle_type public.vehicle_type_enum,
    plate_number TEXT UNIQUE, -- Puede ser NULL si el vehículo no tiene matrícula (ej. Bicicleta)
    phone TEXT,
    status public.courier_status_enum NOT NULL DEFAULT 'Available',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.couriers IS 'Tabla para almacenar información de los repartidores.';
COMMENT ON COLUMN public.couriers.id IS 'Identificador único del repartidor.';
COMMENT ON COLUMN public.couriers.name IS 'Nombre completo del repartidor.';
COMMENT ON COLUMN public.couriers.vehicle_type IS 'Tipo de vehículo que utiliza el repartidor.';
COMMENT ON COLUMN public.couriers.plate_number IS 'Número de matrícula del vehículo (único si existe).';
COMMENT ON COLUMN public.couriers.phone IS 'Número de teléfono del repartidor.';
COMMENT ON COLUMN public.couriers.status IS 'Estado actual del repartidor.';
COMMENT ON COLUMN public.couriers.created_at IS 'Timestamp de creación del registro.';
COMMENT ON COLUMN public.couriers.updated_at IS 'Timestamp de la última actualización del registro.';

-- Trigger para `couriers.updated_at`
CREATE TRIGGER couriers_updated_at_trigger
BEFORE UPDATE ON public.couriers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();


-- 6. Crear Tabla `shipments`
CREATE TABLE public.shipments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tracking_number TEXT UNIQUE NOT NULL DEFAULT substring(replace(gen_random_uuid()::text, '-', ''), 1, 12), -- Generar un tracking number corto
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    courier_id UUID REFERENCES public.couriers(id) ON DELETE SET NULL,
    status public.shipment_status_enum NOT NULL DEFAULT 'Pending',
    estimated_delivery_date TIMESTAMPTZ,
    actual_delivery_date TIMESTAMPTZ,
    package_details JSONB, -- Ejemplo: {"weightKg": 2.5, "dimensionsCm": "30x20x10", "description": "Libros", "type": "Medium Box"}
    cost NUMERIC(10, 2),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.shipments IS 'Tabla para almacenar información de los envíos.';
COMMENT ON COLUMN public.shipments.id IS 'Identificador único del envío.';
COMMENT ON COLUMN public.shipments.tracking_number IS 'Número de seguimiento único para el envío.';
COMMENT ON COLUMN public.shipments.origin IS 'Dirección de origen del envío.';
COMMENT ON COLUMN public.shipments.destination IS 'Dirección de destino del envío.';
COMMENT ON COLUMN public.shipments.client_id IS 'ID del cliente que realiza el envío (FK a clients.id).';
COMMENT ON COLUMN public.shipments.courier_id IS 'ID del repartidor asignado al envío (FK a couriers.id).';
COMMENT ON COLUMN public.shipments.status IS 'Estado actual del envío.';
COMMENT ON COLUMN public.shipments.estimated_delivery_date IS 'Fecha estimada de entrega.';
COMMENT ON COLUMN public.shipments.actual_delivery_date IS 'Fecha real de entrega.';
COMMENT ON COLUMN public.shipments.package_details IS 'Detalles del paquete en formato JSON (peso, dimensiones, descripción, tipo).';
COMMENT ON COLUMN public.shipments.cost IS 'Costo del envío.';
COMMENT ON COLUMN public.shipments.notes IS 'Notas adicionales sobre el envío.';
COMMENT ON COLUMN public.shipments.created_at IS 'Timestamp de creación del registro.';
COMMENT ON COLUMN public.shipments.updated_at IS 'Timestamp de la última actualización del registro.';

-- Trigger para `shipments.updated_at`
CREATE TRIGGER shipments_updated_at_trigger
BEFORE UPDATE ON public.shipments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();


-- 7. Crear Índices para optimización
-- Índices para FKs (aunque PostgreSQL los crea para algunas restricciones, es bueno ser explícito)
CREATE INDEX IF NOT EXISTS idx_shipments_client_id ON public.shipments(client_id);
CREATE INDEX IF NOT EXISTS idx_shipments_courier_id ON public.shipments(courier_id);

-- Índices para columnas de estado
CREATE INDEX IF NOT EXISTS idx_couriers_status ON public.couriers(status);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON public.shipments(status);

-- Índices para búsquedas comunes
CREATE INDEX IF NOT EXISTS idx_clients_name ON public.clients USING GIN (to_tsvector('simple', name));
CREATE INDEX IF NOT EXISTS idx_clients_email ON public.clients(email);
CREATE INDEX IF NOT EXISTS idx_companies_name ON public.companies USING GIN (to_tsvector('simple', name));
CREATE INDEX IF NOT EXISTS idx_companies_email ON public.companies(email);
CREATE INDEX IF NOT EXISTS idx_couriers_name ON public.couriers USING GIN (to_tsvector('simple', name));
CREATE INDEX IF NOT EXISTS idx_shipments_tracking_number ON public.shipments(tracking_number);
CREATE INDEX IF NOT EXISTS idx_shipments_created_at ON public.shipments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_shipments_estimated_delivery_date ON public.shipments(estimated_delivery_date);

-- Índice GIN para búsqueda en package_details (si se requiere buscar por contenido del JSONB)
-- CREATE INDEX idx_shipments_package_details ON public.shipments USING GIN (package_details);

-- 8. Habilitar Row Level Security (RLS) y definir políticas básicas
-- Clients
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow authenticated users to manage clients" ON public.clients;
CREATE POLICY "Allow authenticated users to manage clients"
    ON public.clients
    FOR ALL
    TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Companies
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow authenticated users to manage companies" ON public.companies;
CREATE POLICY "Allow authenticated users to manage companies"
    ON public.companies
    FOR ALL
    TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Couriers
ALTER TABLE public.couriers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow authenticated users to manage couriers" ON public.couriers;
CREATE POLICY "Allow authenticated users to manage couriers"
    ON public.couriers
    FOR ALL
    TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Shipments
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow authenticated users to manage shipments" ON public.shipments;
CREATE POLICY "Allow authenticated users to manage shipments"
    ON public.shipments
    FOR ALL
    TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- (Opcional) Permitir lectura pública si es necesario, o solo a usuarios autenticados:
-- DROP POLICY IF EXISTS "Allow public read access" ON public.some_public_table;
-- CREATE POLICY "Allow public read access"
--     ON public.some_public_table
--     FOR SELECT
--     TO public -- o 'anon', 'authenticated'
--     USING (true);

-- 9. Seed data (Ejemplo, puede estar en seed.sql)
-- INSERT INTO public.clients (name, email, phone, address) VALUES
-- ('Cliente Ejemplo 1', 'cliente1@example.com', '123456789', 'Calle Falsa 123'),
-- ('Cliente Ejemplo 2', 'cliente2@example.com', '987654321', 'Avenida Siempre Viva 742');

-- INSERT INTO public.couriers (name, vehicle_type, plate_number, phone, status) VALUES
-- ('Repartidor Alpha', 'Motorcycle', 'XYZ123', '555111222', 'Available'),
-- ('Repartidor Beta', 'Car', 'ABC789', '555333444', 'On Delivery');

COMMIT;
    