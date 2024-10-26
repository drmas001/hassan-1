import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (employeeCode: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

const SPECIAL_USER = {
  email: 'drmas1191411@icu.medical',
  password: import.meta.env.VITE_SPECIAL_USER_PASSWORD || 'DrMas2002!@#Special',
  metadata: {
    role: 'Doctor',
    name: 'Dr. Mas',
    employeeCode: 'Drmas1191411'
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  signIn: async (employeeCode: string, password: string) => {
    try {
      // Special user case
      if (employeeCode.toLowerCase() === 'drmas1191411' && password === '2002') {
        const { data: existingUser } = await supabase.auth.getUser();

        // If user doesn't exist or is not logged in, create and sign in
        if (!existingUser.user) {
          // Try to sign in first in case user exists
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: SPECIAL_USER.email,
            password: SPECIAL_USER.password
          });

          // If sign in fails, create the user
          if (signInError) {
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
              email: SPECIAL_USER.email,
              password: SPECIAL_USER.password,
              options: {
                data: SPECIAL_USER.metadata
              }
            });

            if (signUpError) throw signUpError;

            // Sign in after successful signup
            const { data: newSignInData, error: newSignInError } = await supabase.auth.signInWithPassword({
              email: SPECIAL_USER.email,
              password: SPECIAL_USER.password
            });

            if (newSignInError) throw newSignInError;
            set({ user: newSignInData.user });
            return;
          }

          set({ user: signInData.user });
          return;
        }

        // User exists and is logged in
        set({ user: existingUser.user });
        return;
      }

      // Regular authentication flow
      const { data, error } = await supabase.auth.signInWithPassword({
        email: `${employeeCode.toLowerCase()}@icu.medical`,
        password,
      });
      
      if (error) throw error;
      set({ user: data.user });
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null });
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },

  initialize: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      set({ user, loading: false });

      // Set up auth state change listener
      supabase.auth.onAuthStateChange((_event, session) => {
        set({ user: session?.user ?? null });
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ loading: false });
    }
  },
}));