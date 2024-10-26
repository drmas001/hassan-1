import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type Patient = Database['public']['Tables']['patients']['Row'];

interface PatientState {
  patients: Patient[];
  loading: boolean;
  error: string | null;
  fetchPatients: () => Promise<void>;
  addPatient: (patient: Omit<Patient, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updatePatient: (id: string, updates: Partial<Patient>) => Promise<void>;
  subscribeToPatients: () => void;
}

export const usePatientStore = create<PatientState>((set, get) => ({
  patients: [],
  loading: false,
  error: null,

  fetchPatients: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('admission_date', { ascending: false });

      if (error) throw error;
      set({ patients: data });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  addPatient: async (patient) => {
    try {
      const { error } = await supabase
        .from('patients')
        .insert([patient]);

      if (error) throw error;
      get().fetchPatients();
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  updatePatient: async (id, updates) => {
    try {
      const { error } = await supabase
        .from('patients')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      get().fetchPatients();
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  subscribeToPatients: () => {
    const subscription = supabase
      .channel('patients_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'patients',
        },
        () => {
          get().fetchPatients();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  },
}));