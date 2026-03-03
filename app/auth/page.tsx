'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, Eye, EyeOff, Chrome, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await new Promise(r => setTimeout(r, 1500));
      window.location.href = '/';
    } catch {
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1000));
      window.location.href = '/';
    } catch {
      setError('Google sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060608] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #C45000, #FF6A00)' }}>
              <Zap className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-white tracking-widest" style={{ fontFamily: 'var(--font-bebas, sans-serif)' }}>
              AUTOGENIUS
            </span>
          </Link>
          <p className="text-[#6b7280] mt-3">AI Auto Intelligence Platform</p>
        </div>

        {/* Card */}
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0d0d10] border border-[#1e1e2e] rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-1">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="text-[#6b7280] text-sm mb-6">
            {mode === 'login' ? 'Sign in to your AutoGenius account' : 'Start your 30-day free Pro trial'}
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Google Sign In */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-[#1e1e2e] text-white hover:bg-[#12121a] transition-colors mb-4 disabled:opacity-50"
          >
            <Chrome className="w-5 h-5 text-blue-400" />
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-[#1e1e2e]" />
            <span className="text-[#6b7280] text-sm">or</span>
            <div className="flex-1 h-px bg-[#1e1e2e]" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="text-xs text-[#6b7280] mb-1 block">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="John Smith"
                  required
                  className="w-full bg-[#12121a] border border-[#1e1e2e] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C45000] placeholder:text-[#6b7280]"
                />
              </div>
            )}

            <div>
              <label className="text-xs text-[#6b7280] mb-1 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-[#12121a] border border-[#1e1e2e] rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-[#C45000] placeholder:text-[#6b7280]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-[#6b7280] mb-1 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  className="w-full bg-[#12121a] border border-[#1e1e2e] rounded-xl pl-10 pr-10 py-3 text-white text-sm focus:outline-none focus:border-[#C45000] placeholder:text-[#6b7280]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === 'login' && (
              <div className="text-right">
                <button type="button" className="text-[#C45000] text-xs hover:underline">
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #C45000, #FF6A00)' }}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {mode === 'login' ? 'Sign In' : 'Create Account — Free Trial'}
            </button>
          </form>

          <p className="text-center text-sm text-[#6b7280] mt-4">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-[#C45000] hover:underline font-medium"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </motion.div>

        {mode === 'register' && (
          <p className="text-center text-xs text-[#6b7280] mt-4">
            By creating an account, you agree to our{' '}
            <span className="text-[#C45000] hover:underline cursor-pointer">Terms of Service</span>{' '}
            and{' '}
            <span className="text-[#C45000] hover:underline cursor-pointer">Privacy Policy</span>
          </p>
        )}
      </div>
    </div>
  );
}
