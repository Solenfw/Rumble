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


export const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/'; // Redirect to sign-in page after signing out
};



