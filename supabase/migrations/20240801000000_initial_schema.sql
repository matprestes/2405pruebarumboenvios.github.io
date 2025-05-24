-- Drop existing objects if they exist (order matters due to dependencies)
DROP TABLE IF EXISTS public.paradas_reparto CASCADE;
DROP TABLE IF EXISTS public.envios CASCADE;
DROP TABLE IF EXISTS public.repartos CASCADE;
DROP TABLE IF EXISTS public.clientes CASCADE;
DROP TABLE IF EXISTS public.empresas CASCADE;
DROP TABLE IF EXISTS public.repartidores CASCADE;
DROP TABLE IF EXISTS public.tipos_paquete CASCADE;
DROP TABLE IF EXISTS public.tipos_servicio CASCADE;
DROP TABLE IF EXISTS public.tarifas_distancia_calculadora CASCADE;

DROP TYPE IF EXISTS public.tipoparadaenum CASCADE;
DROP TYPE IF EXISTS public.tipocalculadoraservicioenum CASCADE;
DROP TYPE IF EXISTS public.estadorepartoenum CASCADE;
DROP TYPE IF EXISTS public.estadorepartidorenum CASCADE;
DROP TYPE IF EXISTS public.estadoenvioenum CASCADE;
DROP TYPE IF EXISTS public.tiporepartoenum CASCADE;


-- Create ENUM types
CREATE TYPE public.tipoparadaenum AS ENUM ('retiro_empresa', 'entrega_cliente');
CREATE TYPE public.tipocalculadoraservicioenum AS ENUM ('lowcost', 'express');
CREATE TYPE public.estadorepartoenum AS ENUM ('asignado', 'en_curso', 'completado');
CREATE TYPE public.estadoenvioenum AS ENUM ('pending', 'suggested', 'asignado_a_reparto', 'en_transito', 'entregado', 'cancelado', 'problema_entrega');
CREATE TYPE public.tiporepartoenum AS ENUM ('individual', 'viaje_empresa', 'viaje_empresa_lote');


-- Function to update 'updated_at' column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Table: empresas
CREATE TABLE public.empresas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  nombre text NOT NULL,
  direccion text NOT NULL,
  latitud numeric NULL,
  longitud numeric NULL,
  telefono text NULL,
  email text NULL,
  notas text NULL,
  estado boolean NOT NULL DEFAULT true,
  CONSTRAINT empresas_pkey PRIMARY KEY (id),
  CONSTRAINT empresas_nombre_key UNIQUE (nombre),
  CONSTRAINT empresas_email_key UNIQUE (email)
) TABLESPACE pg_default;
COMMENT ON TABLE public.empresas IS 'Stores company information.';
CREATE TRIGGER update_empresas_updated_at
  BEFORE UPDATE ON public.empresas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Table: clientes
CREATE TABLE public.clientes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  nombre text NOT NULL,
  apellido text NOT NULL,
  direccion text NOT NULL,
  latitud numeric NULL,
  longitud numeric NULL,
  telefono text NULL,
  email text NULL,
  notas text NULL,
  empresa_id uuid NULL,
  estado boolean NOT NULL DEFAULT true,
  CONSTRAINT clientes_pkey PRIMARY KEY (id),
  CONSTRAINT clientes_email_key UNIQUE (email),
  CONSTRAINT clientes_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES empresas (id) ON DELETE SET NULL
) TABLESPACE pg_default;
COMMENT ON TABLE public.clientes IS 'Stores individual client information.';
CREATE TRIGGER update_clientes_updated_at
  BEFORE UPDATE ON public.clientes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Table: repartidores
CREATE TABLE public.repartidores (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  nombre text NOT NULL,
  estado boolean NOT NULL DEFAULT true,
  CONSTRAINT repartidores_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;
COMMENT ON TABLE public.repartidores IS 'Stores courier information.';
CREATE TRIGGER update_repartidores_updated_at
  BEFORE UPDATE ON public.repartidores
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Table: tipos_paquete
CREATE TABLE public.tipos_paquete (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  descripcion text NULL,
  activo boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT tipos_paquete_pkey PRIMARY KEY (id),
  CONSTRAINT tipos_paquete_nombre_key UNIQUE (nombre)
) TABLESPACE pg_default;
COMMENT ON TABLE public.tipos_paquete IS 'Defines different types of packages.';
CREATE TRIGGER update_tipos_paquete_updated_at
  BEFORE UPDATE ON public.tipos_paquete
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Table: tipos_servicio
CREATE TABLE public.tipos_servicio (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  descripcion text NULL,
  precio_base numeric(10, 2) NULL,
  activo boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT tipos_servicio_pkey PRIMARY KEY (id),
  CONSTRAINT tipos_servicio_nombre_key UNIQUE (nombre)
) TABLESPACE pg_default;
COMMENT ON TABLE public.tipos_servicio IS 'Defines different types of delivery services and their base prices.';
CREATE TRIGGER update_tipos_servicio_updated_at
  BEFORE UPDATE ON public.tipos_servicio
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Table: repartos
CREATE TABLE public.repartos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  fecha_reparto date NOT NULL,
  repartidor_id uuid NULL,
  estado public.estadorepartoenum NOT NULL DEFAULT 'asignado',
  tipo_reparto public.tiporepartoenum NOT NULL,
  empresa_id uuid NULL,
  CONSTRAINT repartos_pkey PRIMARY KEY (id),
  CONSTRAINT repartos_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES empresas (id) ON DELETE SET NULL,
  CONSTRAINT repartos_repartidor_id_fkey FOREIGN KEY (repartidor_id) REFERENCES repartidores (id) ON DELETE SET NULL
) TABLESPACE pg_default;
COMMENT ON TABLE public.repartos IS 'Stores delivery route information.';
CREATE TRIGGER update_repartos_updated_at
  BEFORE UPDATE ON public.repartos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Table: envios
CREATE TABLE public.envios (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  cliente_id uuid NULL,
  nombre_cliente_temporal text NULL,
  client_location text NOT NULL,
  latitud numeric NULL,
  longitud numeric NULL,
  tipo_paquete_id uuid NULL,
  package_weight numeric NOT NULL DEFAULT 0.1,
  status public.estadoenvioenum NOT NULL DEFAULT 'pending',
  suggested_options json NULL,
  reasoning text NULL,
  reparto_id uuid NULL,
  tipo_servicio_id uuid NULL,
  precio_servicio_final numeric(10, 2) NULL,
  CONSTRAINT envios_pkey PRIMARY KEY (id),
  CONSTRAINT envios_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES clientes (id) ON DELETE SET NULL,
  CONSTRAINT envios_reparto_id_fkey FOREIGN KEY (reparto_id) REFERENCES repartos (id) ON DELETE SET NULL,
  CONSTRAINT envios_tipo_paquete_id_fkey FOREIGN KEY (tipo_paquete_id) REFERENCES tipos_paquete (id) ON DELETE SET NULL,
  CONSTRAINT envios_tipo_servicio_id_fkey FOREIGN KEY (tipo_servicio_id) REFERENCES tipos_servicio (id) ON DELETE SET NULL
) TABLESPACE pg_default;
COMMENT ON TABLE public.envios IS 'Stores individual shipment details.';
CREATE TRIGGER update_envios_updated_at
  BEFORE UPDATE ON public.envios
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Table: paradas_reparto
CREATE TABLE public.paradas_reparto (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  reparto_id uuid NOT NULL,
  envio_id uuid NULL,
  tipo_parada public.tipoparadaenum NULL,
  orden integer NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  -- No updated_at here as it's usually immutable or handled differently
  CONSTRAINT paradas_reparto_pkey PRIMARY KEY (id),
  CONSTRAINT uq_reparto_envio UNIQUE (reparto_id, envio_id) DEFERRABLE INITIALLY DEFERRED,
  CONSTRAINT paradas_reparto_envio_id_fkey FOREIGN KEY (envio_id) REFERENCES envios (id) ON DELETE CASCADE,
  CONSTRAINT paradas_reparto_reparto_id_fkey FOREIGN KEY (reparto_id) REFERENCES repartos (id) ON DELETE CASCADE
) TABLESPACE pg_default;
COMMENT ON TABLE public.paradas_reparto IS 'Defines stops within a delivery route, linking repartos to envios or company pickups.';

-- Table: tarifas_distancia_calculadora
CREATE TABLE public.tarifas_distancia_calculadora (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  tipo_calculadora public.tipocalculadoraservicioenum NOT NULL,
  distancia_hasta_km numeric NOT NULL,
  precio numeric(10, 2) NOT NULL,
  fecha_vigencia_desde date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  -- No updated_at here as tariffs are typically versioned by date
  CONSTRAINT tarifas_distancia_calculadora_pkey PRIMARY KEY (id),
  CONSTRAINT uq_tarifa_distancia_calculadora UNIQUE (tipo_calculadora, fecha_vigencia_desde, distancia_hasta_km)
) TABLESPACE pg_default;
COMMENT ON TABLE public.tarifas_distancia_calculadora IS 'Stores distance-based tariffs for the cost calculator.';


-- Indexes for performance
CREATE INDEX idx_clientes_nombre_apellido ON public.clientes USING gin (nombre gin_trgm_ops, apellido gin_trgm_ops);
CREATE INDEX idx_clientes_email ON public.clientes (email);
CREATE INDEX idx_clientes_empresa_id ON public.clientes (empresa_id);

CREATE INDEX idx_empresas_nombre ON public.empresas USING gin (nombre gin_trgm_ops);
CREATE INDEX idx_empresas_email ON public.empresas (email);

CREATE INDEX idx_repartidores_nombre ON public.repartidores USING gin (nombre gin_trgm_ops);
CREATE INDEX idx_repartidores_estado ON public.repartidores (estado);

CREATE INDEX idx_envios_status ON public.envios (status);
CREATE INDEX idx_envios_cliente_id ON public.envios (cliente_id);
CREATE INDEX idx_envios_reparto_id ON public.envios (reparto_id);
CREATE INDEX idx_envios_created_at ON public.envios (created_at DESC);

CREATE INDEX idx_repartos_fecha_reparto ON public.repartos (fecha_reparto DESC);
CREATE INDEX idx_repartos_repartidor_id ON public.repartos (repartidor_id);
CREATE INDEX idx_repartos_empresa_id ON public.repartos (empresa_id);
CREATE INDEX idx_repartos_estado ON public.repartos (estado);

CREATE INDEX idx_paradas_reparto_reparto_id ON public.paradas_reparto (reparto_id);
CREATE INDEX idx_paradas_reparto_envio_id ON public.paradas_reparto (envio_id);
CREATE INDEX idx_paradas_reparto_orden ON public.paradas_reparto (reparto_id, orden);

CREATE INDEX idx_tarifas_tipo_fecha ON public.tarifas_distancia_calculadora (tipo_calculadora, fecha_vigencia_desde);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repartidores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tipos_paquete ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tipos_servicio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repartos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.envios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paradas_reparto ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tarifas_distancia_calculadora ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (ALLOW ALL for authenticated users - refine these for production)
CREATE POLICY "Allow all for authenticated users on empresas" ON public.empresas FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated users on clientes" ON public.clientes FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated users on repartidores" ON public.repartidores FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated users on tipos_paquete" ON public.tipos_paquete FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated users on tipos_servicio" ON public.tipos_servicio FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated users on repartos" ON public.repartos FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated users on envios" ON public.envios FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated users on paradas_reparto" ON public.paradas_reparto FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated users on tarifas_distancia_calculadora" ON public.tarifas_distancia_calculadora FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Allow public read access for calculators if needed (example, adjust as per security requirements)
CREATE POLICY "Allow public read for calculator tariffs" ON public.tarifas_distancia_calculadora FOR SELECT TO public USING (true);

