import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type Vitals = Database['public']['Tables']['vitals']['Row'];

interface VitalsState {
  vitals: Record<string, Vitals[]>;
  loading: boolean;
  error: string | null;
  fetchVitals: (patientId: string) => Promise<void>;
  addVitals: (vitals: Omit<Vitals, 'id' | 'created_at'>) => Promise<void>;
  subscribeToVitals: (patientId: string) => () => void;
}

export const useVitalsStore = create<VitalsState>((set, get) => ({
  vitals: {},
  loading: false,
  error: null,

  fetchVitals: async (patientId) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('vitals')
        .select('*')
        .eq('patient_id', patientId)
        .order('recorded_at', { ascending: false });

      if (error) throw error;
      set((state) => ({
        vitals: {
          ...state.vitals,
          [patientId]: data,
        },
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  addVitals: async (vitals) => {
    try {
      const { error } = await supabase
        .from('vitals')
        .insert([vitals]);

      if (error) throw error;
      get().fetchVitals(vitals.patient_id);
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  subscribeToVitals: (patientId) => {
    const subscription = supabase
      .channel(`vitals_${patientId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vitals',
          filter: `patient_id=eq.${patientId}`,
        },
        () => {
          get().fetchVitals(patientId);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  },
}));