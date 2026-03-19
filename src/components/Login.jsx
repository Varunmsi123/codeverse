import React, { useState } from 'react';
import { Code, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { alert('Please fill all fields'); return; }
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) { alert(data.message || 'Login failed'); return; }
      localStorage.setItem('token', data.token);
      localStorage.setItem('userID', data.user._id);
      window.location.href = '/home';
    } catch (error) {
      console.error('Login Error:', error);
      alert('Something went wrong!');
    } finally { setLoading(false); }
  };

  return (
    <div
      className="min-h-screen w-full bg-black flex items-center justify-center p-4 relative overflow-hidden"
     
    >
      {/* Ambient blobs */}
      <div className="blob-primary" />
      <div className="blob-secondary" />
      <div className="blob-tertiary" />
      <div className="noise-overlay" />
      <div className="grid-overlay" />

      <div className="relative z-10 w-full max-w-sm animate-fade-up">

        {/* Brand */}
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(94,106,210,0.3), rgba(94,106,210,0.1))',
              border: '1px solid rgba(94,106,210,0.35)',
              boxShadow: '0 0 24px rgba(94,106,210,0.25)',
            }}
          >
            <Code size={20} color="#818cf8" />
          </div>
          <span className="text-xl font-semibold tracking-tight" style={{ color: '#EDEDEF' }}>
            Code<span style={{ color: '#818cf8' }}>Verse</span>
          </span>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 24px 64px rgba(0,0,0,0.6)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="mb-7">
            <h1 className="text-2xl font-semibold tracking-tight mb-1" style={{ color: '#EDEDEF' }}>
              Welcome back 👋
            </h1>
            <p className="text-sm" style={{ color: '#8A8F98' }}>Sign in to continue coding</p>
          </div>

          <div className="flex flex-col gap-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-mono tracking-widest uppercase mb-2" style={{ color: '#8A8F98' }}>
                Email
              </label>
              <input
                type="email"
                className="search-input w-full px-4 py-3 text-sm rounded-xl text-white"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit(e)}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-mono tracking-widest uppercase mb-2" style={{ color: '#8A8F98' }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="search-input w-full px-4 py-3 pr-11 text-sm rounded-xl text-white"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit(e)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-150"
                  style={{ color: '#8A8F98' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#EDEDEF'}
                  onMouseLeave={e => e.currentTarget.style.color = '#8A8F98'}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              className="btn-accent w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 mt-2 text-white"
              onClick={handleSubmit}
              disabled={loading}
              style={loading ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                    style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />
                  Signing in…
                </>
              ) : (
                <> Sign In <ArrowRight size={15} /> </>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="mt-6 pt-6 text-center">
            <p className="text-sm" >
              Don't have an account?{' '}
              <a
                href="/register"
                className="font-semibold transition-colors duration-150"
                onMouseEnter={e => e.currentTarget.style.color = '#a5b4fc'}
                onMouseLeave={e => e.currentTarget.style.color = '#818cf8'}
              >
                Register
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs mt-6 font-mono">
          CodeVerse · Competitive Coding
        </p>
      </div>
    </div>
  );
}