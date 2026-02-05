import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  checkAdminStatus: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminStatus = async (): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();
      
      const adminStatus = !!data && !error;
      setIsAdmin(adminStatus);
      return adminStatus;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Handle sign in - check if welcome email needed and update activity
        if (event === 'SIGNED_IN' && session?.user) {
          setTimeout(() => {
            handleWelcomeEmail(session.user.id, session.user.email!, session.user.user_metadata?.full_name);
            updateLastActivity(session.user.id);
            checkAdminStatus();
          }, 0);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        setTimeout(() => {
          checkAdminStatus();
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleWelcomeEmail = async (userId: string, email: string, fullName?: string) => {
    try {
      // Check if welcome email was already sent
      const { data: subscription } = await supabase
        .from('email_subscriptions')
        .select('welcome_email_sent')
        .eq('user_id', userId)
        .maybeSingle();

      // If subscription exists and welcome email already sent, do nothing
      if (subscription?.welcome_email_sent) {
        console.log('Welcome email already sent, skipping');
        return;
      }

      // If no subscription record exists, create one first
      if (!subscription) {
        const { error: insertError } = await supabase
          .from('email_subscriptions')
          .insert({ 
            user_id: userId,
            welcome_email_sent: true 
          });
        
        if (insertError) {
          console.error('Failed to create email subscription:', insertError);
          return;
        }
      } else {
        // Mark welcome email as sent BEFORE sending to prevent duplicates
        await supabase
          .from('email_subscriptions')
          .update({ welcome_email_sent: true })
          .eq('user_id', userId);
      }

      // Now send the email
      await supabase.functions.invoke('send-email', {
        body: { 
          type: 'welcome',
          email,
          fullName,
          userId
        }
      });

      console.log('Welcome email sent successfully');
    } catch (error) {
      console.error('Failed to handle welcome email:', error);
    }
  };

  const updateLastActivity = async (userId: string) => {
    try {
      await supabase
        .from('email_subscriptions')
        .update({ last_activity_at: new Date().toISOString() })
        .eq('user_id', userId);
    } catch (error) {
      console.error('Failed to update last activity:', error);
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName
        }
      }
    });
    
    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { error: error as Error | null };
  };

  const signOut = async () => {
    setIsAdmin(false);
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin, signUp, signIn, signOut, checkAdminStatus }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
