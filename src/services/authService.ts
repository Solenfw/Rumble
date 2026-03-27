import { supabase } from '@services/supabaseClient';

export const handleGoogleSignIn = async () => {
    const {error} = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/home`
      }
    });
    if (error) {
      console.error('Error during Google sign-in:', error.message);
    }
};

export const handleEmailSignIn = async (
  email: string,
  password: string
): Promise<{ error?: string }> => {
  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { error: error.message };
    }
    return {};
  } catch (err: any) {
    return { error: err.message || 'Unknown error' };
  }
};

export const handleSignOut = async () => {
    await supabase.auth.signOut();
    // Clear any cached auth data and force a page reload to ensure clean state
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = '/signin';
};



