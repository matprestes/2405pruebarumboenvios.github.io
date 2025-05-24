
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      empresas: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          nombre: string
          direccion: string 
          latitud: number | null
          longitud: number | null
          telefono: string | null
          email: string | null
          notas: string | null
          estado: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          nombre: string
          direccion: string 
          latitud?: number | null
          longitud?: number | null
          telefono?: string | null
          email?: string | null
          notas?: string | null
          estado?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          nombre?: string
          direccion?: string
          latitud?: number | null
          longitud?: number | null
          telefono?: string | null
          email?: string | null
          notas?: string | null
          estado?: boolean
        }
      }
      clientes: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          nombre: string
          apellido: string
          direccion: string
          latitud: number | null
          longitud: number | null
          telefono: string | null
          email: string | null
          notas: string | null
          empresa_id: string | null
          estado: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          nombre: string
          apellido: string
          direccion: string
          latitud?: number | null
          longitud?: number | null
          telefono?: string | null
          email?: string | null
          notas?: string | null
          empresa_id?: string | null
          estado?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          nombre?: string
          apellido?: string
          direccion?: string
          latitud?: number | null
          longitud?: number | null
          telefono?: string | null
          email?: string | null
          notas?: string | null
          empresa_id?: string | null
          estado?: boolean
        }
      }
      repartidores: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          nombre: string
          estado: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          nombre: string
          estado?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          nombre?: string
          estado?: boolean
        }
      }
      tipos_paquete: {
        Row: {
          id: string
          nombre: string
          descripcion: string | null
          activo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre: string
          descripcion?: string | null
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          descripcion?: string | null
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      tipos_servicio: {
        Row: {
          id: string
          nombre: string
          descripcion: string | null
          precio_base: number | null
          activo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre: string
          descripcion?: string | null
          precio_base?: number | null
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          descripcion?: string | null
          precio_base?: number | null
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      repartos: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          fecha_reparto: string // DATE
          repartidor_id: string | null
          estado: Enums<"estadorepartoenum"> // Use ENUM type
          tipo_reparto: Enums<"tiporepartoenum"> // Use ENUM type
          empresa_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          fecha_reparto: string // DATE
          repartidor_id?: string | null
          estado?: Enums<"estadorepartoenum">
          tipo_reparto: Enums<"tiporepartoenum">
          empresa_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          fecha_reparto?: string // DATE
          repartidor_id?: string | null
          estado?: Enums<"estadorepartoenum">
          tipo_reparto?: Enums<"tiporepartoenum">
          empresa_id?: string | null
        }
      }
      envios: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          cliente_id: string | null
          nombre_cliente_temporal: string | null
          client_location: string
          latitud: number | null
          longitud: number | null
          tipo_paquete_id: string | null
          package_weight: number
          status: Enums<"estadoenvioenum"> // Use ENUM type
          suggested_options: Json | null
          reasoning: string | null
          reparto_id: string | null
          tipo_servicio_id: string | null
          precio_servicio_final: number | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          cliente_id?: string | null
          nombre_cliente_temporal?: string | null
          client_location: string
          latitud?: number | null
          longitud?: number | null
          tipo_paquete_id?: string | null
          package_weight?: number
          status?: Enums<"estadoenvioenum">
          suggested_options?: Json | null
          reasoning?: string | null
          reparto_id?: string | null
          tipo_servicio_id?: string | null
          precio_servicio_final?: number | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          cliente_id?: string | null
          nombre_cliente_temporal?: string | null
          client_location?: string
          latitud?: number | null
          longitud?: number | null
          tipo_paquete_id?: string | null
          package_weight?: number
          status?: Enums<"estadoenvioenum">
          suggested_options?: Json | null
          reasoning?: string | null
          reparto_id?: string | null
          tipo_servicio_id?: string | null
          precio_servicio_final?: number | null
        }
      }
      paradas_reparto: {
        Row: {
          id: string
          reparto_id: string
          envio_id: string | null
          tipo_parada: Enums<"tipoparadaenum"> | null
          orden: number
          created_at: string
        }
        Insert: {
          id?: string
          reparto_id: string
          envio_id?: string | null
          tipo_parada?: Enums<"tipoparadaenum"> | null
          orden: number
          created_at?: string
        }
        Update: {
          id?: string
          reparto_id?: string
          envio_id?: string | null
          tipo_parada?: Enums<"tipoparadaenum"> | null
          orden?: number
          created_at?: string
        }
      }
      tarifas_distancia_calculadora: {
        Row: {
            id: string
            tipo_calculadora: Enums<"tipocalculadoraservicioenum">
            distancia_hasta_km: number
            precio: number
            fecha_vigencia_desde: string // DATE
            created_at: string
        }
        Insert: {
            id?: string
            tipo_calculadora: Enums<"tipocalculadoraservicioenum">
            distancia_hasta_km: number
            precio: number
            fecha_vigencia_desde?: string // DATE
            created_at?: string
        }
        Update: {
            id?: string
            tipo_calculadora?: Enums<"tipocalculadoraservicioenum">
            distancia_hasta_km?: number
            precio?: number
            fecha_vigencia_desde?: string // DATE
            created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      tipoparadaenum: "retiro_empresa" | "entrega_cliente"
      tipocalculadoraservicioenum: "lowcost" | "express"
      estadorepartoenum: 'asignado' | 'en_curso' | 'completado'
      estadoenvioenum: 'pending' | 'suggested' | 'asignado_a_reparto' | 'en_transito' | 'entregado' | 'cancelado' | 'problema_entrega'
      tiporepartoenum: 'individual' | 'viaje_empresa' | 'viaje_empresa_lote'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types
export type Empresa = Database['public']['Tables']['empresas']['Row'];
export type NuevaEmpresa = Database['public']['Tables']['empresas']['Insert'];
export type UpdateEmpresa = Database['public']['Tables']['empresas']['Update'];

export type Cliente = Database['public']['Tables']['clientes']['Row'];
export type NuevoCliente = Database['public']['Tables']['clientes']['Insert'];
export type UpdateCliente = Database['public']['Tables']['clientes']['Update'];

export type Repartidor = Database['public']['Tables']['repartidores']['Row'];
export type NuevoRepartidor = Database['public']['Tables']['repartidores']['Insert'];
export type UpdateRepartidor = Database['public']['Tables']['repartidores']['Update'];

export type TipoPaquete = Database['public']['Tables']['tipos_paquete']['Row'];
export type NuevoTipoPaquete = Database['public']['Tables']['tipos_paquete']['Insert'];
export type UpdateTipoPaquete = Database['public']['Tables']['tipos_paquete']['Update'];

export type TipoServicio = Database['public']['Tables']['tipos_servicio']['Row'];
export type NuevoTipoServicio = Database['public']['Tables']['tipos_servicio']['Insert'];
export type UpdateTipoServicio = Database['public']['Tables']['tipos_servicio']['Update'];

export type TarifaDistanciaCalculadora = Database['public']['Tables']['tarifas_distancia_calculadora']['Row'];
export type NuevaTarifaDistanciaCalculadora = Database['public']['Tables']['tarifas_distancia_calculadora']['Insert'];
export type UpdateTarifaDistanciaCalculadora = Database['public']['Tables']['tarifas_distancia_calculadora']['Update'];

export type Reparto = Database['public']['Tables']['repartos']['Row'];
export type NuevoReparto = Database['public']['Tables']['repartos']['Insert'];
export type UpdateReparto = Database['public']['Tables']['repartos']['Update'];

export type Envio = Database['public']['Tables']['envios']['Row'];
export type NuevoEnvio = Database['public']['Tables']['envios']['Insert'];
export type UpdateEnvio = Database['public']['Tables']['envios']['Update'];

export type ParadaReparto = Database['public']['Tables']['paradas_reparto']['Row'];
export type NuevaParadaReparto = Database['public']['Tables']['paradas_reparto']['Insert'];


// Extended types for relations
export type RepartoConDetalles = Reparto & {
  repartidores: Pick<Repartidor, 'id' | 'nombre'> | null;
  empresas: Pick<Empresa, 'id' | 'nombre' | 'direccion' | 'latitud' | 'longitud'> | null;
};

export type EnvioConClienteYAjustes = Envio & {
  clientes: Pick<Cliente, 'id' | 'nombre' | 'apellido' | 'direccion' | 'email'> | null;
  tipos_paquete: Pick<TipoPaquete, 'id' | 'nombre'> | null;
  tipos_servicio?: Pick<TipoServicio, 'id' | 'nombre'> | null;
};

export type EnvioParaDetalleReparto = Envio & {
  clientes: Pick<Cliente, 'id' | 'nombre' | 'apellido' | 'direccion' | 'email' | 'telefono'> | null;
  tipos_servicio: Pick<TipoServicio, 'id' | 'nombre' | 'precio_base'> | null;
  tipos_paquete: Pick<TipoPaquete, 'id' | 'nombre'> | null;
};

export type ParadaConEnvioYCliente = ParadaReparto & {
  envio: EnvioParaDetalleReparto | null;
};

export type RepartoCompleto = RepartoConDetalles & {
  paradas: ParadaConEnvioYCliente[];
};

export type ClienteWithEmpresa = Cliente & {
  empresa: Pick<Empresa, 'id' | 'nombre'> | null;
};

export type EnvioMapa = Pick<Envio, 
  'id' | 
  'latitud' | 
  'longitud' | 
  'status' | 
  'client_location' | 
  'package_weight' | 
  'cliente_id' | 
  'nombre_cliente_temporal' | 
  'tipo_paquete_id' |
  'suggested_options' |
  'reasoning' |
  'reparto_id' |
  'tipo_servicio_id' |
  'precio_servicio_final' |
  'created_at' |
  'updated_at'
> & {
  nombre_cliente: string | null; 
  tipo_paquete_nombre?: string | null;
  orden?: number | null;
  tipo_parada?: Enums<"tipoparadaenum"> | null;
};


export interface RepartoParaFiltro {
  id: string;
  label: string;
  empresa_id?: string | null;
  empresa_nombre?: string | null;
  tipo_reparto?: Enums<"tiporepartoenum"> | null; // Use ENUM
}

export type TipoParadaEnum = Database['public']['Enums']['tipoparadaenum'];
export type TipoCalculadoraServicioEnum = Database['public']['Enums']['tipocalculadoraservicioenum'];
export type EstadoRepartoEnum = Database['public']['Enums']['estadorepartoenum'];
export type EstadoEnvioEnum = Database['public']['Enums']['estadoenvioenum'];
export type TipoRepartoEnum = Database['public']['Enums']['tiporepartoenum'];


export type EnvioCompletoParaDialog = Envio & {
  clientes: Pick<Cliente, 'id' | 'nombre' | 'apellido' | 'direccion' | 'email' | 'telefono' | 'latitud' | 'longitud'> | null;
  repartos: (Pick<Reparto, 'id' | 'fecha_reparto'> & {
      repartidores: Pick<Repartidor, 'nombre'> | null;
  }) | null;
  tipos_servicio: Pick<TipoServicio, 'id' | 'nombre' | 'precio_base'> | null;
  tipos_paquete: Pick<TipoPaquete, 'id'| 'nombre'> | null;
};

// Ensure Enums type helper is available
export type Enums<T extends keyof Database[Extract<keyof Database, "public">]["Enums"]> =
  Database[Extract<keyof Database, "public">]["Enums"][T]

