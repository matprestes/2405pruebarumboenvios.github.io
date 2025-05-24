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
      clients: {
        Row: {
          address: string | null
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          address: string | null
          contact_person: string | null
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      couriers: {
        Row: {
          created_at: string
          id: string
          name: string
          phone: string | null
          plate_number: string | null
          status: Database["public"]["Enums"]["courier_status_enum"]
          updated_at: string
          vehicle_type: Database["public"]["Enums"]["vehicle_type_enum"] | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          phone?: string | null
          plate_number?: string | null
          status?: Database["public"]["Enums"]["courier_status_enum"]
          updated_at?: string
          vehicle_type?: Database["public"]["Enums"]["vehicle_type_enum"] | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          phone?: string | null
          plate_number?: string | null
          status?: Database["public"]["Enums"]["courier_status_enum"]
          updated_at?: string
          vehicle_type?: Database["public"]["Enums"]["vehicle_type_enum"] | null
        }
        Relationships: []
      }
      shipments: {
        Row: {
          actual_delivery_date: string | null
          client_id: string | null
          cost: number | null
          courier_id: string | null
          created_at: string
          destination: string
          estimated_delivery_date: string | null
          id: string
          notes: string | null
          origin: string
          package_details: Json | null
          status: Database["public"]["Enums"]["shipment_status_enum"]
          tracking_number: string
          updated_at: string
        }
        Insert: {
          actual_delivery_date?: string | null
          client_id?: string | null
          cost?: number | null
          courier_id?: string | null
          created_at?: string
          destination: string
          estimated_delivery_date?: string | null
          id?: string
          notes?: string | null
          origin: string
          package_details?: Json | null
          status?: Database["public"]["Enums"]["shipment_status_enum"]
          tracking_number?: string
          updated_at?: string
        }
        Update: {
          actual_delivery_date?: string | null
          client_id?: string | null
          cost?: number | null
          courier_id?: string | null
          created_at?: string
          destination?: string
          estimated_delivery_date?: string | null
          id?: string
          notes?: string | null
          origin?: string
          package_details?: Json | null
          status?: Database["public"]["Enums"]["shipment_status_enum"]
          tracking_number?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shipments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipments_courier_id_fkey"
            columns: ["courier_id"]
            isOneToOne: false
            referencedRelation: "couriers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      courier_status_enum: "Available" | "On Delivery" | "Offline"
      shipment_status_enum:
        | "Pending"
        | "In Transit"
        | "Delivered"
        | "Cancelled"
        | "Issue"
      vehicle_type_enum: "Motorcycle" | "Car" | "Van" | "Bicycle" | "Truck"
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
      courier_status_enum: ["Available", "On Delivery", "Offline"],
      shipment_status_enum: [
        "Pending",
        "In Transit",
        "Delivered",
        "Cancelled",
        "Issue",
      ],
      vehicle_type_enum: ["Motorcycle", "Car", "Van", "Bicycle", "Truck"],
    },
  },
} as const
