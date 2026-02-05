import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

// Safe storage handler with memory fallback
const createSafeStorage = () => {
  const memoryStorage = new Map<string, string>();

  return {
    getItem: (key: string) => {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          return localStorage.getItem(key);
        }
      } catch (e) {
        // Access denied - silently use memory storage
      }
      return memoryStorage.get(key) || null;
    },
    setItem: (key: string, value: string) => {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem(key, value);
          return;
        }
      } catch (e) {
        // Access denied - silently use memory storage
      }
      memoryStorage.set(key, value);
    },
    removeItem: (key: string) => {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.removeItem(key);
          return;
        }
      } catch (e) {
        // Access denied - silently use memory storage
      }
      memoryStorage.delete(key);
    }
  };
};

const safeLocalStorage = createSafeStorage();

// Initialize Supabase with error-safe configuration
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: safeLocalStorage,
    storageKey: 'sb-auth-token',
    persistSession: false, // Disable persistence to avoid SecurityError
    autoRefreshToken: false, // Disable auto-refresh to avoid cross-origin issues
    detectSessionInUrl: false, // Disable URL detection to avoid SecurityError
    flowType: 'implicit'
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web'
    }
  }
});