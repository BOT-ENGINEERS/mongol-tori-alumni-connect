export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string | null
          date: string | null
          description: string | null
          id: string
          image_url: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          date?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          title?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          company: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          location: string | null
          posted_by: string | null
          requirements: string | null
          salary_range: string | null
          title: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          company: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          posted_by?: string | null
          requirements?: string | null
          salary_range?: string | null
          title: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          company?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          posted_by?: string | null
          requirements?: string | null
          salary_range?: string | null
          title?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_posted_by_fkey"
            columns: ["posted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      merchandise: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_digital: boolean | null
          name: string
          price: number
          stock: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_digital?: boolean | null
          name: string
          price: number
          stock?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_digital?: boolean | null
          name?: string
          price?: number
          stock?: number | null
        }
        Relationships: []
      }
      news: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          image_url: string | null
          is_external: boolean | null
          published_at: string | null
          source: string | null
          source_url: string | null
          title: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_external?: boolean | null
          published_at?: string | null
          source?: string | null
          source_url?: string | null
          title: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_external?: boolean | null
          published_at?: string | null
          source?: string | null
          source_url?: string | null
          title?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          merchandise_id: string | null
          order_id: string | null
          price: number
          quantity: number | null
        }
        Insert: {
          id?: string
          merchandise_id?: string | null
          order_id?: string | null
          price: number
          quantity?: number | null
        }
        Update: {
          id?: string
          merchandise_id?: string | null
          order_id?: string | null
          price?: number
          quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_merchandise_id_fkey"
            columns: ["merchandise_id"]
            isOneToOne: false
            referencedRelation: "merchandise"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          id: string
          shipping_address: string | null
          status: string | null
          total_amount: number
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          shipping_address?: string | null
          status?: string | null
          total_amount: number
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          shipping_address?: string | null
          status?: string | null
          total_amount?: number
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          bio: string | null
          company: string | null
          created_at: string | null
          current_education: string | null
          email: string | null
          facebook_url: string | null
          full_name: string
          id: string
          instagram_url: string | null
          is_advisor: boolean | null
          is_alumni: boolean | null
          linkedin_url: string | null
          past_education: string | null
          phone: string | null
          photo_url: string | null
          position: string | null
          semester: string | null
          team_role: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bio?: string | null
          company?: string | null
          created_at?: string | null
          current_education?: string | null
          email?: string | null
          facebook_url?: string | null
          full_name: string
          id?: string
          instagram_url?: string | null
          is_advisor?: boolean | null
          is_alumni?: boolean | null
          linkedin_url?: string | null
          past_education?: string | null
          phone?: string | null
          photo_url?: string | null
          position?: string | null
          semester?: string | null
          team_role?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bio?: string | null
          company?: string | null
          created_at?: string | null
          current_education?: string | null
          email?: string | null
          facebook_url?: string | null
          full_name?: string
          id?: string
          instagram_url?: string | null
          is_advisor?: boolean | null
          is_alumni?: boolean | null
          linkedin_url?: string | null
          past_education?: string | null
          phone?: string | null
          photo_url?: string | null
          position?: string | null
          semester?: string | null
          team_role?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
