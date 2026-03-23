import React from 'react';
import { Link } from 'react-router-dom';
import { handleGoogleSignIn } from '@services/authService';

const SignUp: React.FC = () => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 font-mono"
      style={{
        background: 'linear-gradient(to bottom, #000000 0%, #666666 100%)'
      }}
    >
      <div className="w-full max-w-480 min-h-270 flex items-center justify-center">
        <div className="bg-transparent w-full max-w-xl p-8 md:p-12 flex flex-col items-center">
          <h1 className="text-white text-6xl font-bold mb-12 text-center">Sign up</h1>
          
          <form className="w-full space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <label className="text-white text-lg block" htmlFor="username">
                Your username
              </label>
              <input
                type="text"
                id="username"
                className="w-full bg-[#d9d9d9] text-black h-14 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-white text-lg block" htmlFor="email">
                Your email
              </label>
              <input
                type="email"
                id="email"
                className="w-full bg-[#d9d9d9] text-black h-14 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-white text-lg block" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full bg-[#d9d9d9] text-black h-14 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="text-white text-lg block" htmlFor="confirm-password">
                Confirm password
              </label>
              <input
                type="password"
                id="confirm-password"
                className="w-full bg-[#d9d9d9] text-black h-14 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start space-x-3 pt-2">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="terms" className="text-white text-sm leading-tight">
                I agree to the <Link to="#" className="underline">Terms of Service</Link> and <Link to="#" className="underline">Privacy Policy</Link>*
              </label>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full bg-[#4a6d7c] hover:bg-[#5a7d8c] text-white text-2xl font-bold h-16 rounded-xl mt-4 transition-all transform active:scale-95 shadow-lg"
            >
              Sign up
            </button>

            {/* Divider */}
            <div className="flex items-center space-x-4 py-4">
              <div className="flex-1 h-px bg-gray-500"></div>
              <span className="text-white font-bold">Or</span>
              <div className="flex-1 h-px bg-gray-500"></div>
            </div>

            {/* Google Sign Up Button */}
            <button
              onClick={handleGoogleSignIn}
              type="button"
              className="w-full bg-transparent border-2 border-white hover:bg-white/10 text-white flex items-center justify-center space-x-3 h-16 rounded-xl transition-all"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-xl">Sign up with Google</span>
            </button>

            {/* Footer Text */}
            <div className="text-center pt-8 text-white text-lg">
              Already have an account?{' '}
              <Link to="/signin" className="font-bold hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
