// features/auth/model/authStore.ts
import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { AuthResponse } from '@/entities/auth/model/types';

interface AuthSlice {
  user: AuthResponse['user'] | null;
  token: string | null;
  isAuthenticated: boolean;
  error: string | null;

  setUser: (u: AuthResponse['user'] | null) => void;
  setToken: (t: string | null) => void;
  setError: (e: string | null) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthSlice>()(
  persist(
    subscribeWithSelector((set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token, isAuthenticated: !!token }),
      setError: (error) => set({ error }),
      reset: () => set({ user: null, token: null, isAuthenticated: false, error: null })
    })),
    {
      name: 'auth',              
      partialize: (s) => ({ token: s.token }), 
    }
  )
);
