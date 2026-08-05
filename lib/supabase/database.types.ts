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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      contracts: {
        Row: {
          contract_number: string | null
          created_at: string | null
          customer_id: string | null
          estimate_id: string | null
          id: string
          issue_date: string | null
          job_id: string | null
          notes: string | null
          pdf_url: string | null
          sent_at: string | null
          sent_to: string | null
          signature_token: string | null
          signed: boolean | null
          signed_at: string | null
          signed_by_name: string | null
          signed_ip: string | null
          signed_pdf_url: string | null
          signed_signature: string | null
          status: string | null
          terms: string | null
        }
        Insert: {
          contract_number?: string | null
          created_at?: string | null
          customer_id?: string | null
          estimate_id?: string | null
          id?: string
          issue_date?: string | null
          job_id?: string | null
          notes?: string | null
          pdf_url?: string | null
          sent_at?: string | null
          sent_to?: string | null
          signature_token?: string | null
          signed?: boolean | null
          signed_at?: string | null
          signed_by_name?: string | null
          signed_ip?: string | null
          signed_pdf_url?: string | null
          signed_signature?: string | null
          status?: string | null
          terms?: string | null
        }
        Update: {
          contract_number?: string | null
          created_at?: string | null
          customer_id?: string | null
          estimate_id?: string | null
          id?: string
          issue_date?: string | null
          job_id?: string | null
          notes?: string | null
          pdf_url?: string | null
          sent_at?: string | null
          sent_to?: string | null
          signature_token?: string | null
          signed?: boolean | null
          signed_at?: string | null
          signed_by_name?: string | null
          signed_ip?: string | null
          signed_pdf_url?: string | null
          signed_signature?: string | null
          status?: string | null
          terms?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_estimate_id_fkey"
            columns: ["estimate_id"]
            isOneToOne: false
            referencedRelation: "estimates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_activity: {
        Row: {
          activity_type: string
          created_at: string | null
          customer_id: string
          description: string | null
          id: string
          title: string
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          customer_id: string
          description?: string | null
          id?: string
          title: string
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          customer_id?: string
          description?: string | null
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_activity_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_documents: {
        Row: {
          created_at: string | null
          customer_id: string
          document_type: string
          file_url: string
          id: string
          signed_date: string | null
          status: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          document_type: string
          file_url: string
          id?: string
          signed_date?: string | null
          status?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          document_type?: string
          file_url?: string
          id?: string
          signed_date?: string | null
          status?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_documents_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          city: string | null
          created_at: string | null
          customer_number: string | null
          email: string | null
          first_name: string
          id: string
          last_name: string
          notes: string | null
          phone: string | null
          portal_created_at: string | null
          portal_token: string | null
          state: string | null
          status: string | null
          updated_at: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          customer_number?: string | null
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          notes?: string | null
          phone?: string | null
          portal_created_at?: string | null
          portal_token?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          customer_number?: string | null
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          notes?: string | null
          phone?: string | null
          portal_created_at?: string | null
          portal_token?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      employees: {
        Row: {
          created_at: string | null
          email: string | null
          first_name: string
          hire_date: string | null
          hourly_rate: number | null
          id: string
          last_name: string
          notes: string | null
          phone: string | null
          role: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          first_name: string
          hire_date?: string | null
          hourly_rate?: number | null
          id?: string
          last_name: string
          notes?: string | null
          phone?: string | null
          role?: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          first_name?: string
          hire_date?: string | null
          hourly_rate?: number | null
          id?: string
          last_name?: string
          notes?: string | null
          phone?: string | null
          role?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      estimate_items: {
        Row: {
          created_at: string
          description: string
          discount: number | null
          estimate_id: string
          id: string
          quantity: number
          sort_order: number | null
          taxable: boolean | null
          total: number
          unit: string | null
          unit_price: number
        }
        Insert: {
          created_at?: string
          description: string
          discount?: number | null
          estimate_id: string
          id?: string
          quantity?: number
          sort_order?: number | null
          taxable?: boolean | null
          total?: number
          unit?: string | null
          unit_price?: number
        }
        Update: {
          created_at?: string
          description?: string
          discount?: number | null
          estimate_id?: string
          id?: string
          quantity?: number
          sort_order?: number | null
          taxable?: boolean | null
          total?: number
          unit?: string | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "estimate_items_estimate_id_fkey"
            columns: ["estimate_id"]
            isOneToOne: false
            referencedRelation: "estimates"
            referencedColumns: ["id"]
          },
        ]
      }
      estimates: {
        Row: {
          created_at: string
          customer_id: string
          discount: number | null
          estimate_code: string | null
          estimate_number: number
          expiration_date: string | null
          id: string
          issue_date: string
          notes: string | null
          sent_at: string | null
          signature_data: string | null
          signature_status: string | null
          signature_token: string | null
          signed_at: string | null
          signed_by_name: string | null
          signed_ip: string | null
          signed_pdf_url: string | null
          signed_signature: string | null
          status: string
          subtotal: number
          tax: number
          tax_rate: number | null
          terms: string | null
          total: number
          updated_at: string
          viewed_at: string | null
        }
        Insert: {
          created_at?: string
          customer_id: string
          discount?: number | null
          estimate_code?: string | null
          estimate_number?: never
          expiration_date?: string | null
          id?: string
          issue_date?: string
          notes?: string | null
          sent_at?: string | null
          signature_data?: string | null
          signature_status?: string | null
          signature_token?: string | null
          signed_at?: string | null
          signed_by_name?: string | null
          signed_ip?: string | null
          signed_pdf_url?: string | null
          signed_signature?: string | null
          status?: string
          subtotal?: number
          tax?: number
          tax_rate?: number | null
          terms?: string | null
          total?: number
          updated_at?: string
          viewed_at?: string | null
        }
        Update: {
          created_at?: string
          customer_id?: string
          discount?: number | null
          estimate_code?: string | null
          estimate_number?: never
          expiration_date?: string | null
          id?: string
          issue_date?: string
          notes?: string | null
          sent_at?: string | null
          signature_data?: string | null
          signature_status?: string | null
          signature_token?: string | null
          signed_at?: string | null
          signed_by_name?: string | null
          signed_ip?: string | null
          signed_pdf_url?: string | null
          signed_signature?: string | null
          status?: string
          subtotal?: number
          tax?: number
          tax_rate?: number | null
          terms?: string | null
          total?: number
          updated_at?: string
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "estimates_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      expense_categories: {
        Row: {
          created_at: string
          description: string | null
          group_name: string
          id: string
          is_system: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          group_name?: string
          id?: string
          is_system?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          group_name?: string
          id?: string
          is_system?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category_id: string | null
          created_at: string
          customer_id: string | null
          date: string
          description: string
          employee_id: string | null
          expense_number: string
          id: string
          job_id: string | null
          notes: string | null
          payment_method: string
          receipt_url: string | null
          status: string
          updated_at: string
          vendor_id: string | null
        }
        Insert: {
          amount: number
          category_id?: string | null
          created_at?: string
          customer_id?: string | null
          date?: string
          description: string
          employee_id?: string | null
          expense_number: string
          id?: string
          job_id?: string | null
          notes?: string | null
          payment_method?: string
          receipt_url?: string | null
          status?: string
          updated_at?: string
          vendor_id?: string | null
        }
        Update: {
          amount?: number
          category_id?: string | null
          created_at?: string
          customer_id?: string | null
          date?: string
          description?: string
          employee_id?: string | null
          expense_number?: string
          id?: string
          job_id?: string | null
          notes?: string | null
          payment_method?: string
          receipt_url?: string | null
          status?: string
          updated_at?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "expense_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          created_at: string | null
          description: string | null
          discount: number | null
          id: string
          invoice_id: string
          quantity: number | null
          sort_order: number | null
          taxable: boolean | null
          total: number | null
          unit: string | null
          unit_price: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          discount?: number | null
          id?: string
          invoice_id: string
          quantity?: number | null
          sort_order?: number | null
          taxable?: boolean | null
          total?: number | null
          unit?: string | null
          unit_price?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          discount?: number | null
          id?: string
          invoice_id?: string
          quantity?: number | null
          sort_order?: number | null
          taxable?: boolean | null
          total?: number | null
          unit?: string | null
          unit_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_payments: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          invoice_id: string | null
          notes: string | null
          payment_date: string | null
          payment_method: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          invoice_id?: string | null
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          invoice_id?: string | null
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount_paid: number | null
          balance_due: number | null
          created_at: string | null
          customer_id: string | null
          due_date: string | null
          estimate_id: string | null
          id: string
          invoice_number: string | null
          issue_date: string | null
          job_id: string | null
          paid_at: string | null
          payment_date: string | null
          payment_method: string | null
          payment_notes: string | null
          status: string | null
          subtotal: number | null
          tax: number | null
          total: number | null
          updated_at: string | null
        }
        Insert: {
          amount_paid?: number | null
          balance_due?: number | null
          created_at?: string | null
          customer_id?: string | null
          due_date?: string | null
          estimate_id?: string | null
          id?: string
          invoice_number?: string | null
          issue_date?: string | null
          job_id?: string | null
          paid_at?: string | null
          payment_date?: string | null
          payment_method?: string | null
          payment_notes?: string | null
          status?: string | null
          subtotal?: number | null
          tax?: number | null
          total?: number | null
          updated_at?: string | null
        }
        Update: {
          amount_paid?: number | null
          balance_due?: number | null
          created_at?: string | null
          customer_id?: string | null
          due_date?: string | null
          estimate_id?: string | null
          id?: string
          invoice_number?: string | null
          issue_date?: string | null
          job_id?: string | null
          paid_at?: string | null
          payment_date?: string | null
          payment_method?: string | null
          payment_notes?: string | null
          status?: string | null
          subtotal?: number | null
          tax?: number | null
          total?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_estimate_id_fkey"
            columns: ["estimate_id"]
            isOneToOne: false
            referencedRelation: "estimates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_photos: {
        Row: {
          caption: string | null
          category: string
          created_at: string | null
          id: string
          image_url: string
          job_id: string
        }
        Insert: {
          caption?: string | null
          category?: string
          created_at?: string | null
          id?: string
          image_url: string
          job_id: string
        }
        Update: {
          caption?: string | null
          category?: string
          created_at?: string | null
          id?: string
          image_url?: string
          job_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_photos_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          assigned_employee_id: string | null
          completed_date: string | null
          completion_notes: string | null
          created_at: string | null
          customer_id: string | null
          customer_phone: string | null
          customer_signature: string | null
          description: string | null
          end_time: string | null
          estimate_id: string | null
          id: string
          invoice_id: string | null
          job_number: string | null
          notes: string | null
          priority: string | null
          scheduled_date: string | null
          service_address: string | null
          start_time: string | null
          status: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_employee_id?: string | null
          completed_date?: string | null
          completion_notes?: string | null
          created_at?: string | null
          customer_id?: string | null
          customer_phone?: string | null
          customer_signature?: string | null
          description?: string | null
          end_time?: string | null
          estimate_id?: string | null
          id?: string
          invoice_id?: string | null
          job_number?: string | null
          notes?: string | null
          priority?: string | null
          scheduled_date?: string | null
          service_address?: string | null
          start_time?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_employee_id?: string | null
          completed_date?: string | null
          completion_notes?: string | null
          created_at?: string | null
          customer_id?: string | null
          customer_phone?: string | null
          customer_signature?: string | null
          description?: string | null
          end_time?: string | null
          estimate_id?: string | null
          id?: string
          invoice_id?: string | null
          job_number?: string | null
          notes?: string | null
          priority?: string | null
          scheduled_date?: string | null
          service_address?: string | null
          start_time?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_assigned_employee_id_fkey"
            columns: ["assigned_employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_estimate_id_fkey"
            columns: ["estimate_id"]
            isOneToOne: false
            referencedRelation: "estimates"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          invoice_id: string
          notes: string | null
          payment_date: string
          payment_method: string
          reference_number: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          invoice_id: string
          notes?: string | null
          payment_date?: string
          payment_method: string
          reference_number?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          invoice_id?: string
          notes?: string | null
          payment_date?: string
          payment_method?: string
          reference_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_payments_invoice"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          can_create: boolean
          can_delete: boolean
          can_read: boolean
          can_update: boolean
          created_at: string
          id: string
          resource: string
          role: string
          updated_at: string
        }
        Insert: {
          can_create?: boolean
          can_delete?: boolean
          can_read?: boolean
          can_update?: boolean
          created_at?: string
          id?: string
          resource: string
          role: string
          updated_at?: string
        }
        Update: {
          can_create?: boolean
          can_delete?: boolean
          can_read?: boolean
          can_update?: boolean
          created_at?: string
          id?: string
          resource?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      sequences: {
        Row: {
          current_value: number
          name: string
          prefix: string
          updated_at: string
        }
        Insert: {
          current_value?: number
          name: string
          prefix: string
          updated_at?: string
        }
        Update: {
          current_value?: number
          name?: string
          prefix?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          customer_id: string | null
          employee_id: string | null
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          employee_id?: string | null
          role: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          employee_id?: string | null
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          address: string | null
          category: string | null
          company: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          category?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          category?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_contract_number: { Args: never; Returns: string }
      generate_invoice_number: { Args: never; Returns: string }
      generate_job_number: { Args: never; Returns: string }
      has_permission: {
        Args: { target_action: string; target_resource: string }
        Returns: boolean
      }
      next_document_number: { Args: { sequence_name: string }; Returns: string }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
