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
      patients: {
        Row: {
          id: string
          name: string
          age: number
          gender: string
          personal_code: string
          admission_date: string
          attending_physician_id: string
          status: 'Stable' | 'Critical' | 'Serious' | 'Discharged'
          history: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          age: number
          gender: string
          personal_code: string
          admission_date?: string
          attending_physician_id: string
          status: 'Stable' | 'Critical' | 'Serious' | 'Discharged'
          history?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          age?: number
          gender?: string
          personal_code?: string
          admission_date?: string
          attending_physician_id?: string
          status?: 'Stable' | 'Critical' | 'Serious' | 'Discharged'
          history?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      vitals: {
        Row: {
          id: string
          patient_id: string
          blood_pressure: string
          oxygen_saturation: number
          heart_rate: number
          temperature: number
          ventilation_settings: string | null
          recorded_at: string
          created_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          blood_pressure: string
          oxygen_saturation: number
          heart_rate: number
          temperature: number
          ventilation_settings?: string | null
          recorded_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          blood_pressure?: string
          oxygen_saturation?: number
          heart_rate?: number
          temperature?: number
          ventilation_settings?: string | null
          recorded_at?: string
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
      [_ in never]: never
    }
  }
}