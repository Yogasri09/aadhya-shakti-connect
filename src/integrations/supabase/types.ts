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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          buyer_id: string
          created_at: string
          duration_minutes: number
          id: string
          notes: string | null
          phone: string
          scheduled_at: string
          seller_id: string
          service_id: string
          status: string
          total_price: number
          updated_at: string
        }
        Insert: {
          buyer_id: string
          created_at?: string
          duration_minutes?: number
          id?: string
          notes?: string | null
          phone: string
          scheduled_at: string
          seller_id: string
          service_id: string
          status?: string
          total_price?: number
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          created_at?: string
          duration_minutes?: number
          id?: string
          notes?: string | null
          phone?: string
          scheduled_at?: string
          seller_id?: string
          service_id?: string
          status?: string
          total_price?: number
          updated_at?: string
        }
        Relationships: []
      }
      communities: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          name: string
          skill_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          name: string
          skill_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          name?: string
          skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "communities_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      community_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_events: {
        Row: {
          community_id: string
          created_at: string
          created_by: string
          description: string | null
          ends_at: string | null
          id: string
          location: string | null
          skill_id: string
          starts_at: string
          title: string
        }
        Insert: {
          community_id: string
          created_at?: string
          created_by: string
          description?: string | null
          ends_at?: string | null
          id?: string
          location?: string | null
          skill_id: string
          starts_at: string
          title: string
        }
        Update: {
          community_id?: string
          created_at?: string
          created_by?: string
          description?: string | null
          ends_at?: string | null
          id?: string
          location?: string | null
          skill_id?: string
          starts_at?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_events_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_events_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      community_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_members: {
        Row: {
          community_id: string
          id: string
          joined_at: string
          user_id: string
        }
        Insert: {
          community_id: string
          id?: string
          joined_at?: string
          user_id: string
        }
        Update: {
          community_id?: string
          id?: string
          joined_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_members_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          author_id: string
          community_id: string
          content: string
          created_at: string
          event_date: string | null
          event_location: string | null
          id: string
          is_news: boolean
          media_type: string | null
          media_url: string | null
          post_type: string
          skill_id: string
          title: string | null
        }
        Insert: {
          author_id: string
          community_id: string
          content: string
          created_at?: string
          event_date?: string | null
          event_location?: string | null
          id?: string
          is_news?: boolean
          media_type?: string | null
          media_url?: string | null
          post_type?: string
          skill_id: string
          title?: string | null
        }
        Update: {
          author_id?: string
          community_id?: string
          content?: string
          created_at?: string
          event_date?: string | null
          event_location?: string | null
          id?: string
          is_news?: boolean
          media_type?: string | null
          media_url?: string | null
          post_type?: string
          skill_id?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_posts_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      community_saved_posts: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_saved_posts_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_shares: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_shares_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          buyer_id: string
          created_at: string
          id: string
          last_message_at: string
          product_id: string | null
          seller_id: string
          service_id: string | null
        }
        Insert: {
          buyer_id: string
          created_at?: string
          id?: string
          last_message_at?: string
          product_id?: string | null
          seller_id: string
          service_id?: string | null
        }
        Update: {
          buyer_id?: string
          created_at?: string
          id?: string
          last_message_at?: string
          product_id?: string | null
          seller_id?: string
          service_id?: string | null
        }
        Relationships: []
      }
      courses: {
        Row: {
          category: string
          city: string | null
          created_at: string
          description: string | null
          duration: string | null
          enrolled_count: number
          id: string
          instructor: string | null
          is_active: boolean
          level: string | null
          state: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          city?: string | null
          created_at?: string
          description?: string | null
          duration?: string | null
          enrolled_count?: number
          id?: string
          instructor?: string | null
          is_active?: boolean
          level?: string | null
          state?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          city?: string | null
          created_at?: string
          description?: string | null
          duration?: string | null
          enrolled_count?: number
          id?: string
          instructor?: string | null
          is_active?: boolean
          level?: string | null
          state?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      mentor_requests: {
        Row: {
          created_at: string
          id: string
          mentee_id: string
          mentor_id: string
          message: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          mentee_id: string
          mentor_id: string
          message?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          mentee_id?: string
          mentor_id?: string
          message?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      mentor_sessions: {
        Row: {
          created_at: string
          duration_minutes: number | null
          id: string
          mentee_id: string
          mentor_id: string
          notes: string | null
          scheduled_at: string | null
          status: string
        }
        Insert: {
          created_at?: string
          duration_minutes?: number | null
          id?: string
          mentee_id: string
          mentor_id: string
          notes?: string | null
          scheduled_at?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          duration_minutes?: number | null
          id?: string
          mentee_id?: string
          mentor_id?: string
          notes?: string | null
          scheduled_at?: string | null
          status?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          is_read: boolean
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          is_read?: boolean
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          is_read?: boolean
          sender_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          buyer_id: string
          created_at: string
          id: string
          notes: string | null
          phone: string
          product_id: string
          quantity: number
          seller_id: string
          shipping_address: string
          status: string
          total_price: number
          updated_at: string
        }
        Insert: {
          buyer_id: string
          created_at?: string
          id?: string
          notes?: string | null
          phone: string
          product_id: string
          quantity?: number
          seller_id: string
          shipping_address: string
          status?: string
          total_price?: number
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          phone?: string
          product_id?: string
          quantity?: number
          seller_id?: string
          shipping_address?: string
          status?: string
          total_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          city: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          images: string[] | null
          name: string
          price: number
          seller_id: string
          state: string | null
          status: string
          stock: number
          updated_at: string
          views_count: number
        }
        Insert: {
          category?: string
          city?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          name: string
          price?: number
          seller_id: string
          state?: string | null
          status?: string
          stock?: number
          updated_at?: string
          views_count?: number
        }
        Update: {
          category?: string
          city?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          name?: string
          price?: number
          seller_id?: string
          state?: string | null
          status?: string
          stock?: number
          updated_at?: string
          views_count?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          interest: string | null
          location: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id?: string
          interest?: string | null
          location?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          interest?: string | null
          location?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      questionnaire_responses: {
        Row: {
          created_at: string
          id: string
          responses: Json
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          responses?: Json
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          responses?: Json
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          body: string | null
          booking_id: string | null
          created_at: string
          id: string
          is_reported: boolean
          order_id: string | null
          rating: number
          target_id: string
          target_type: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          body?: string | null
          booking_id?: string | null
          created_at?: string
          id?: string
          is_reported?: boolean
          order_id?: string | null
          rating: number
          target_id: string
          target_type: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          body?: string | null
          booking_id?: string | null
          created_at?: string
          id?: string
          is_reported?: boolean
          order_id?: string | null
          rating?: number
          target_id?: string
          target_type?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      schemes: {
        Row: {
          benefits: string | null
          category: string
          created_at: string
          description: string | null
          eligibility: string | null
          id: string
          is_active: boolean
          state: string | null
          title: string
          updated_at: string
        }
        Insert: {
          benefits?: string | null
          category?: string
          created_at?: string
          description?: string | null
          eligibility?: string | null
          id?: string
          is_active?: boolean
          state?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          benefits?: string | null
          category?: string
          created_at?: string
          description?: string | null
          eligibility?: string | null
          id?: string
          is_active?: boolean
          state?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          availability: string | null
          category: string
          city: string | null
          created_at: string
          description: string | null
          experience_level: string | null
          id: string
          image_url: string | null
          is_active: boolean
          price: number
          pricing_type: string
          seller_id: string
          state: string | null
          title: string
          updated_at: string
          views_count: number
        }
        Insert: {
          availability?: string | null
          category?: string
          city?: string | null
          created_at?: string
          description?: string | null
          experience_level?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          price?: number
          pricing_type?: string
          seller_id: string
          state?: string | null
          title: string
          updated_at?: string
          views_count?: number
        }
        Update: {
          availability?: string | null
          category?: string
          city?: string | null
          created_at?: string
          description?: string | null
          experience_level?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          price?: number
          pricing_type?: string
          seller_id?: string
          state?: string | null
          title?: string
          updated_at?: string
          views_count?: number
        }
        Relationships: []
      }
      skills: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
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
      wishlists: {
        Row: {
          created_at: string
          id: string
          target_id: string
          target_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          target_id: string
          target_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          target_id?: string
          target_type?: string
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
      is_conversation_participant: {
        Args: { _conv_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "user" | "seller" | "mentor" | "admin"
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
      app_role: ["user", "seller", "mentor", "admin"],
    },
  },
} as const
