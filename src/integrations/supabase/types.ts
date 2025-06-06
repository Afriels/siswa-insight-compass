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
      behavior_records: {
        Row: {
          action: string | null
          behavior_type: string
          created_at: string
          date: string
          description: string
          id: string
          location: string | null
          recorder_id: string | null
          student_id: string
        }
        Insert: {
          action?: string | null
          behavior_type: string
          created_at?: string
          date: string
          description: string
          id?: string
          location?: string | null
          recorder_id?: string | null
          student_id: string
        }
        Update: {
          action?: string | null
          behavior_type?: string
          created_at?: string
          date?: string
          description?: string
          id?: string
          location?: string | null
          recorder_id?: string | null
          student_id?: string
        }
        Relationships: []
      }
      consultation_messages: {
        Row: {
          consultation_id: string | null
          created_at: string
          id: string
          message: string
          sender_id: string | null
        }
        Insert: {
          consultation_id?: string | null
          created_at?: string
          id?: string
          message: string
          sender_id?: string | null
        }
        Update: {
          consultation_id?: string | null
          created_at?: string
          id?: string
          message?: string
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consultation_messages_consultation_id_fkey"
            columns: ["consultation_id"]
            isOneToOne: false
            referencedRelation: "consultations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultation_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      consultations: {
        Row: {
          created_at: string
          description: string
          id: string
          status: string | null
          student_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          status?: string | null
          student_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          status?: string | null
          student_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultations_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      counseling_schedules: {
        Row: {
          counselor_id: string | null
          created_at: string
          description: string
          id: string
          location: string
          scheduled_at: string
          status: string
          student_id: string | null
          title: string
        }
        Insert: {
          counselor_id?: string | null
          created_at?: string
          description: string
          id?: string
          location: string
          scheduled_at: string
          status?: string
          student_id?: string | null
          title: string
        }
        Update: {
          counselor_id?: string | null
          created_at?: string
          description?: string
          id?: string
          location?: string
          scheduled_at?: string
          status?: string
          student_id?: string | null
          title?: string
        }
        Relationships: []
      }
      forum_topics: {
        Row: {
          category: string
          created_at: string | null
          created_by: string | null
          description: string
          id: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string
          created_at?: string | null
          created_by?: string | null
          description: string
          id?: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          created_by?: string | null
          description?: string
          id?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_topics_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          role: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          role?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          role?: string | null
          username?: string | null
        }
        Relationships: []
      }
      psychology_test_questions: {
        Row: {
          created_at: string
          id: string
          options: Json
          order_index: number
          question_text: string
          question_type: string
          scoring_config: Json | null
          test_template_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          options?: Json
          order_index?: number
          question_text: string
          question_type?: string
          scoring_config?: Json | null
          test_template_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          options?: Json
          order_index?: number
          question_text?: string
          question_type?: string
          scoring_config?: Json | null
          test_template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "psychology_test_questions_test_template_id_fkey"
            columns: ["test_template_id"]
            isOneToOne: false
            referencedRelation: "psychology_test_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      psychology_test_sessions: {
        Row: {
          answers: Json | null
          completed_at: string | null
          created_at: string
          id: string
          results: Json | null
          started_at: string
          status: string
          test_template_id: string | null
          user_id: string | null
        }
        Insert: {
          answers?: Json | null
          completed_at?: string | null
          created_at?: string
          id?: string
          results?: Json | null
          started_at?: string
          status?: string
          test_template_id?: string | null
          user_id?: string | null
        }
        Update: {
          answers?: Json | null
          completed_at?: string | null
          created_at?: string
          id?: string
          results?: Json | null
          started_at?: string
          status?: string
          test_template_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "psychology_test_sessions_test_template_id_fkey"
            columns: ["test_template_id"]
            isOneToOne: false
            referencedRelation: "psychology_test_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      psychology_test_templates: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          description: string
          duration_minutes: number
          id: string
          instructions: string | null
          is_active: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          created_by?: string | null
          description: string
          duration_minutes?: number
          id?: string
          instructions?: string | null
          is_active?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string
          duration_minutes?: number
          id?: string
          instructions?: string | null
          is_active?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      whatsapp_templates: {
        Row: {
          category: string | null
          created_at: string | null
          created_by: string | null
          id: string
          message_template: string
          name: string
          subject: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          message_template: string
          name: string
          subject: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          message_template?: string
          name?: string
          subject?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
