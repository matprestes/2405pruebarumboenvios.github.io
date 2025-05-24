export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      clientes: {
        Row: {
          apellido: string
          created_at: string
          direccion: string
          email: string | null
          empresa_id: string | null
          estado: boolean
          id: string
          latitud: number | null
          longitud: number | null
          nombre: string
          notas: string | null
          telefono: string | null
        }
        Insert: {
          apellido: string
          created_at?: string
          direccion: string
          email?: string | null
          empresa_id?: string | null
          estado?: boolean
          id?: string
          latitud?: number | null
          longitud?: number | null
          nombre: string
          notas?: string | null
          telefono?: string | null
        }
        Update: {
          apellido?: string
          created_at?: string
          direccion?: string
          email?: string | null
          empresa_id?: string | null
          estado?: boolean
          id?: string
          latitud?: number | null
          longitud?: number | null
          nombre?: string
          notas?: string | null
          telefono?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clientes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      empresas: {
        Row: {
          created_at: string
          direccion: string
          email: string | null
          estado: boolean
          id: string
          latitud: number | null
          longitud: number | null
          nombre: string
          notas: string | null
          telefono: string | null
        }
        Insert: {
          created_at?: string
          direccion: string
          email?: string | null
          estado?: boolean
          id?: string
          latitud?: number | null
          longitud?: number | null
          nombre: string
          notas?: string | null
          telefono?: string | null
        }
        Update: {
          created_at?: string
          direccion?: string
          email?: string | null
          estado?: boolean
          id?: string
          latitud?: number | null
          longitud?: number | null
          nombre?: string
          notas?: string | null
          telefono?: string | null
        }
        Relationships: []
      }
      envios: {
        Row: {
          client_location: string
          cliente_id: string | null
          created_at: string
          id: string
          latitud: number | null
          longitud: number | null
          nombre_cliente_temporal: string | null
          package_weight: number
          precio_servicio_final: number | null
          reasoning: string | null
          reparto_id: string | null
          status: string
          suggested_options: Json | null
          tipo_paquete_id: string | null
          tipo_servicio_id: string | null
        }
        Insert: {
          client_location: string
          cliente_id?: string | null
          created_at?: string
          id?: string
          latitud?: number | null
          longitud?: number | null
          nombre_cliente_temporal?: string | null
          package_weight?: number
          precio_servicio_final?: number | null
          reasoning?: string | null
          reparto_id?: string | null
          status?: string
          suggested_options?: Json | null
          tipo_paquete_id?: string | null
          tipo_servicio_id?: string | null
        }
        Update: {
          client_location?: string
          cliente_id?: string | null
          created_at?: string
          id?: string
          latitud?: number | null
          longitud?: number | null
          nombre_cliente_temporal?: string | null
          package_weight?: number
          precio_servicio_final?: number | null
          reasoning?: string | null
          reparto_id?: string | null
          status?: string
          suggested_options?: Json | null
          tipo_paquete_id?: string | null
          tipo_servicio_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "envios_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "envios_reparto_id_fkey"
            columns: ["reparto_id"]
            isOneToOne: false
            referencedRelation: "repartos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "envios_tipo_paquete_id_fkey"
            columns: ["tipo_paquete_id"]
            isOneToOne: false
            referencedRelation: "tipos_paquete"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "envios_tipo_servicio_id_fkey"
            columns: ["tipo_servicio_id"]
            isOneToOne: false
            referencedRelation: "tipos_servicio"
            referencedColumns: ["id"]
          },
        ]
      }
      paradas_reparto: {
        Row: {
          created_at: string
          envio_id: string | null
          id: string
          orden: number
          reparto_id: string
          tipo_parada: Database["public"]["Enums"]["tipoparadaenum"] | null
        }
        Insert: {
          created_at?: string
          envio_id?: string | null
          id?: string
          orden: number
          reparto_id: string
          tipo_parada?: Database["public"]["Enums"]["tipoparadaenum"] | null
        }
        Update: {
          created_at?: string
          envio_id?: string | null
          id?: string
          orden?: number
          reparto_id?: string
          tipo_parada?: Database["public"]["Enums"]["tipoparadaenum"] | null
        }
        Relationships: [
          {
            foreignKeyName: "paradas_reparto_envio_id_fkey"
            columns: ["envio_id"]
            isOneToOne: false
            referencedRelation: "envios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paradas_reparto_reparto_id_fkey"
            columns: ["reparto_id"]
            isOneToOne: false
            referencedRelation: "repartos"
            referencedColumns: ["id"]
          },
        ]
      }
      repartidores: {
        Row: {
          created_at: string
          estado: boolean
          id: string
          nombre: string
        }
        Insert: {
          created_at?: string
          estado?: boolean
          id?: string
          nombre: string
        }
        Update: {
          created_at?: string
          estado?: boolean
          id?: string
          nombre?: string
        }
        Relationships: []
      }
      repartos: {
        Row: {
          created_at: string
          empresa_id: string | null
          estado: string
          fecha_reparto: string
          id: string
          repartidor_id: string | null
          tipo_reparto: string
        }
        Insert: {
          created_at?: string
          empresa_id?: string | null
          estado?: string
          fecha_reparto: string
          id?: string
          repartidor_id?: string | null
          tipo_reparto: string
        }
        Update: {
          created_at?: string
          empresa_id?: string | null
          estado?: string
          fecha_reparto?: string
          id?: string
          repartidor_id?: string | null
          tipo_reparto?: string
        }
        Relationships: [
          {
            foreignKeyName: "repartos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repartos_repartidor_id_fkey"
            columns: ["repartidor_id"]
            isOneToOne: false
            referencedRelation: "repartidores"
            referencedColumns: ["id"]
          },
        ]
      }
      tarifas_distancia_calculadora: {
        Row: {
          created_at: string
          distancia_hasta_km: number
          fecha_vigencia_desde: string
          id: string
          precio: number
          tipo_calculadora: Database["public"]["Enums"]["tipocalculadoraservicioenum"]
        }
        Insert: {
          created_at?: string
          distancia_hasta_km: number
          fecha_vigencia_desde?: string
          id?: string
          precio: number
          tipo_calculadora: Database["public"]["Enums"]["tipocalculadoraservicioenum"]
        }
        Update: {
          created_at?: string
          distancia_hasta_km?: number
          fecha_vigencia_desde?: string
          id?: string
          precio?: number
          tipo_calculadora?: Database["public"]["Enums"]["tipocalculadoraservicioenum"]
        }
        Relationships: []
      }
      tipos_paquete: {
        Row: {
          activo: boolean
          created_at: string
          descripcion: string | null
          id: string
          nombre: string
        }
        Insert: {
          activo?: boolean
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre: string
        }
        Update: {
          activo?: boolean
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre?: string
        }
        Relationships: []
      }
      tipos_servicio: {
        Row: {
          activo: boolean
          created_at: string
          descripcion: string | null
          id: string
          nombre: string
          precio_base: number | null
        }
        Insert: {
          activo?: boolean
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre: string
          precio_base?: number | null
        }
        Update: {
          activo?: boolean
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre?: string
          precio_base?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      tipocalculadoraservicioenum: "lowcost" | "express"
      tipoparadaenum: "retiro_empresa" | "entrega_cliente"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      tipocalculadoraservicioenum: ["lowcost", "express"],
      tipoparadaenum: ["retiro_empresa", "entrega_cliente"],
    },
  },
} as const
