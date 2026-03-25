'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { Profile } from '@/types/database';

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  updateProfile: (newProfile: Profile) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  updateProfile: () => {},
});

// Helper to get from localStorage safely
const getStored = (key: string) => {
  if (typeof window === 'undefined') return null;
  const val = localStorage.getItem(key);
  try {
    const parsed = val ? JSON.parse(val) : null;
    // Robust check: Ensure we didn't get a double-stringified value
    if (parsed && typeof parsed === 'object') return parsed;
    if (typeof parsed === 'string') {
       // Deep parse just in case
       const deepParsed = JSON.parse(parsed);
       return (deepParsed && typeof deepParsed === 'object') ? deepParsed : null;
    }
  } catch {
    return null;
  }
  return null;
};

// The middleware now handles authentication hint cookies automatically.

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => getStored('raptor_user'));
  const [profile, setProfile] = useState<Profile | null>(() => getStored('raptor_profile'));
  
  // If we have cached data OR an auth hint cookie, we can start with loading=false for a zero-latency refresh
  const [loading, setLoading] = useState(() => {
    const hasCache = !!(getStored('raptor_user') && getStored('raptor_profile'));
    return !hasCache;
  });

  useEffect(() => {
    let mounted = true;

    // Safety fallback: Force stop loading very quickly if things hang
    const fallbackTimeout = setTimeout(() => {
      if (mounted) setLoading(false);
    }, 800); // Reduced from 2000ms

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          if (error.message.toLowerCase().includes('refresh token') || error.message.toLowerCase().includes('token not found')) {
            console.warn('Auth session invalid, clearing state...');
            await signOut();
            return;
          }
          console.error('Session check error:', error);
        }
      } catch (err) {
        console.error('Auth initialization failed:', err);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        try {
          // Robust Protection: If session is mistakenly passed as a string, parse it
          let actualSession = session;
          if (typeof session === 'string') {
              try { actualSession = JSON.parse(session); } catch { actualSession = null; }
          }

          const currentUser = actualSession?.user ?? null;
          
          // Update user state immediately with object-safety
          if (currentUser && typeof currentUser === 'object') {
            setUser(currentUser);
            if (typeof window !== 'undefined') {
              localStorage.setItem('raptor_user', JSON.stringify(currentUser));
            }
          } else {
            setUser(null);
            if (typeof window !== 'undefined') {
              localStorage.removeItem('raptor_user');
            }
          }

          if (currentUser && typeof currentUser === 'object' && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED')) {
            const { data, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', currentUser.id)
              .single();
            
            if (error && (error.message.includes('steal') || error.message.includes('JSON'))) {
               // Ignore dev locks or malformed JSON responses
               return;
            }

            if (mounted && data) {
              setProfile(data);
              if (typeof window !== 'undefined') {
                localStorage.setItem('raptor_profile', JSON.stringify(data));
              }
            }
          } else if (event === 'SIGNED_OUT') {
            if (mounted) {
              setProfile(null);
              setLoading(false);
            }
          }
        } catch (err: any) {
          console.error('CRITICAL AUTH ERROR (AUTO-REPAIRING):', err);
          // If we hit a property-on-string error, purge everything
          if (err.message?.includes('property') || err.message?.includes('string')) {
             if (typeof window !== 'undefined') {
                localStorage.clear();
                window.location.reload();
             }
          }
        } finally {
          if (mounted) setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      clearTimeout(fallbackTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      setLoading(true);
      // Clear local storage and cookies first
      if (typeof window !== 'undefined') {
        localStorage.removeItem('raptor_user');
        localStorage.removeItem('raptor_profile');
      }
      
      // Clear Supabase session
      await supabase.auth.signOut();
      
      // Reset local state
      setUser(null);
      setProfile(null);
      
      // Force redirect to login
      window.location.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback redirect even if error
      window.location.replace('/login');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = (newProfile: Profile) => {
    setProfile(newProfile);
    if (typeof window !== 'undefined') {
      localStorage.setItem('raptor_profile', JSON.stringify(newProfile));
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
