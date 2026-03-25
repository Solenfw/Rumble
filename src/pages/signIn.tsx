import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@contexts/authContext';
import { handleGoogleSignIn, handleEmailSignIn } from '@services/authService';

const SignIn: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) navigate('/home', { replace: true });
  }, [user, authLoading, navigate]);

  const handleEmailSignInLocal = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await handleEmailSignIn(email, password);
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    navigate('/home', { replace: true });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 font-mono">
      <div className="w-full max-w-480 min-h-270 bg-[#0d0d0d] flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-2xl border border-gray-800">

        {/* Left Side: Login Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-24 py-12 bg-linear-to-b from-black to-[#1a1a1a]">
          <div className="max-w-md w-full mx-auto">
            <h1 className="text-white text-6xl font-bold mb-16 tracking-tight">Sign in</h1>

            {/* Error message */}
            {error && (
              <div className="mb-6 px-4 py-3 bg-red-900/40 border border-red-700/50 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleEmailSignInLocal} className="space-y-8">
              <div className="space-y-2">
                <label className="text-gray-400 text-lg block" htmlFor="email">
                  Your email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#d9d9d9] text-black h-14 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-gray-400 text-lg block" htmlFor="password">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-gray-400 text-lg hover:text-white transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#d9d9d9] text-black h-14 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#4a6d7c] hover:cursor-pointer hover:bg-[#5a7d8c] disabled:opacity-50 disabled:cursor-not-allowed text-white text-3xl font-bold h-16 rounded-xl mt-8 transition-all transform active:scale-95 shadow-lg"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center space-x-4 py-8">
              <div className="flex-1 h-px bg-gray-700"></div>
              <span className="text-gray-500 font-bold">Or</span>
              <div className="flex-1 h-px bg-gray-700"></div>
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full bg-transparent border-2 border-white hover:cursor-pointer hover:bg-white/10 text-white flex items-center justify-center space-x-3 h-16 rounded-xl transition-all"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-xl">Sign in with Google</span>
            </button>

            <div className="mt-10 text-center md:text-left text-gray-400 text-lg">
              Don't have an account?{' '}
              <Link to="/signup" className="text-white font-bold hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side: Image */}
        <div className="hidden md:flex md:w-1/2 p-6">
          <div className="w-full h-full rounded-[40px] overflow-hidden relative group">
            <img
              src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Earth from space"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;