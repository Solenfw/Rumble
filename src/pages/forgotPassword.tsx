import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@services/supabaseClient';
import { ArrowLeft } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 font-mono">
      <Link to="/" className="absolute top-8 left-8 text-gray-500 hover:text-white flex items-center gap-2 transition-colors">
        <ArrowLeft className="w-5 h-5" /> Back to Landing
      </Link>

      <div className="w-full max-w-md">
        <h1 className="text-white text-4xl font-bold mb-4">Reset password</h1>
        <p className="text-gray-400 mb-10">
          Enter your email and we'll send you a reset link.
        </p>

        {sent ? (
          <div className="text-center">
            <p className="text-white mb-6">
              Check <span className="font-semibold">{email}</span> for a reset link.
            </p>
            <Link to="/signin" className="text-gray-400 hover:text-white transition-colors text-sm">
              Back to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="px-4 py-3 bg-red-900/40 border border-red-700/50 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#d9d9d9] text-black h-14 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4a6d7c] hover:bg-[#5a7d8c] disabled:opacity-50 text-white text-xl font-bold h-14 rounded-xl transition-all"
            >
              {loading ? 'Sending...' : 'Send reset link'}
            </button>
            <div className="text-center">
              <Link to="/signin" className="text-gray-400 hover:text-white transition-colors text-sm">
                Back to sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;