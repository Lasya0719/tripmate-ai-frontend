/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Compass,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Lock,
  Mail,
  User,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { UserProfile } from '../../types';

interface AuthPageProps {
  initialMode?: 'login' | 'signup';
  onAuthSuccess: (user: UserProfile) => void;
  onNavigateHome: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'login',
  onAuthSuccess,
  onNavigateHome,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI status
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const validateEmail = (val: string) => {
    return /\S+@\S+\.\S+/.test(val);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setPassword('');
    setError('Account sign-in is not connected yet. Continue as Guest; do not enter a real password.');
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    setPassword('');
    setConfirmPassword('');
    setError('Account creation is not connected yet. Continue as Guest; account sync is unavailable.');
  };

  const handleGoogleClick = () => {
    setInfoMessage(
      'Google sign-in is not configured for this application. Continue as Guest to explore.'
    );
  };

  const handleContinueAsGuest = () => {
    onAuthSuccess({
      id: `guest-${Date.now()}`,
      name: 'Guest Traveler',
      email: 'guest@tripmate.local',
      isGuest: true,
    });
  };

  return (
    <div className="min-h-screen w-full flex bg-stone-50 text-stone-900">
      {/* Left Column: Atmospheric Travel Photograph */}
      <div className="hidden lg:relative lg:flex lg:w-1/2 bg-stone-900 overflow-hidden flex-col justify-between p-12 text-white">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1600&q=80"
            alt="Scenic coastal journey"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-stone-950/20" />
        </div>

        {/* Top Branding & Return */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-md">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <span className="font-serif-display text-2xl font-bold tracking-tight text-white block leading-none">
                TripMate
              </span>
              <span className="text-[10px] tracking-widest text-amber-300 uppercase font-medium">
                Intelligent Travel
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-xs font-medium text-stone-200 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Landing</span>
          </button>
        </div>

        {/* Atmospheric Quote */}
        <div className="relative z-10 max-w-lg space-y-4">
          <div className="text-xs font-semibold uppercase tracking-widest text-amber-300">
            Personalised Journeys
          </div>
          <h2 className="font-serif-display text-4xl sm:text-5xl font-bold leading-tight">
            Every journey starts somewhere.
          </h2>
          <p className="text-stone-300 text-base leading-relaxed">
            Let's create a travel experience that feels yours. From peaceful mist-covered valleys to accessible riverfront itineraries, begin your conversation today.
          </p>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-stone-400">
          &copy; {new Date().getFullYear()} TripMate. Crafted for discerning travelers.
        </div>
      </div>

      {/* Right Column: Authentication Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12">
        <div className="max-w-md w-full mx-auto space-y-8 text-left">
          {/* Mobile Back button and logo */}
          <div className="lg:hidden flex items-center justify-between pb-4 border-b border-stone-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-serif-display text-xl font-bold text-stone-900">
                TripMate
              </span>
            </div>
            <button
              type="button"
              onClick={onNavigateHome}
              className="text-xs font-medium text-stone-600 hover:text-stone-900 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          </div>

          {/* Form Header */}
          <div>
            <h3 className="font-serif-display text-3xl font-bold text-stone-900">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-stone-500">
              {mode === 'login'
                ? 'Account sign-in is not connected in this build. Continue as Guest to explore.'
                : 'Account creation is not connected in this build. Guest data does not sync across devices.'}
            </p>
          </div>

          {/* Error & Info banners */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {infoMessage && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{infoMessage}</span>
            </div>
          )}

          {/* Forms */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setInfoMessage('Password recovery email link is ready for provider integration.')}
                    className="text-xs text-amber-800 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs text-stone-600">
                  Remember me for 30 days
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl text-sm font-semibold bg-stone-900 hover:bg-stone-800 text-white transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  Full name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Lasya Rao"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl text-sm font-semibold bg-stone-900 hover:bg-stone-800 text-white transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Social or Guest Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-stone-50 px-3 text-stone-400 font-medium">Or continue with</span>
            </div>
          </div>

          {/* Continue with Google & Continue as Guest */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={handleGoogleClick}
              className="w-full py-2.5 px-4 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-2.5 shadow-2xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google sign-in (not configured)</span>
            </button>

            <button
              type="button"
              onClick={handleContinueAsGuest}
              className="w-full py-2.5 px-4 rounded-xl border border-stone-200 bg-stone-100 hover:bg-stone-200/80 text-stone-800 text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <span>Continue as Guest</span>
              <ArrowRight className="w-3.5 h-3.5 text-stone-500" />
            </button>
            <p className="text-center text-[11px] leading-relaxed text-stone-500">
              Guest conversations are kept only in the current browser session and are not synced across devices.
            </p>
          </div>

          {/* Toggle between Login and Signup */}
          <div className="text-center pt-2 text-xs text-stone-600">
            {mode === 'login' ? (
              <p>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setError(null);
                    setInfoMessage(null);
                  }}
                  className="font-semibold text-amber-800 hover:underline"
                >
                  Create an account
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                    setInfoMessage(null);
                  }}
                  className="font-semibold text-amber-800 hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
