import React, { useState } from "react";
import { Code, Eye, EyeOff, User, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { API_URL } from '../config';

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      alert("Registration successful! Redirecting to login...");
      window.location.href = "/";

    } catch (error) {
      console.error("Registration Error:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="blob-primary" />
      <div className="blob-secondary" />
      <div className="blob-tertiary" />
      <div className="noise-overlay" />
      <div className="grid-overlay" />

      {/* Decorative floating particles */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none opacity-20"
          style={{
            width: `${Math.random() * 6 + 2}px`,
            height: `${Math.random() * 6 + 2}px`,
            background: 'var(--info)',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            boxShadow: '0 0 8px var(--info)',
          }}
        />
      ))}

      <div className="relative z-10 w-full max-w-sm animate-fade-up">
        {/* Brand */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
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
          className="rounded-2xl p-7 sm:p-8"
          style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 24px 64px rgba(0,0,0,0.6)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight mb-1" style={{ color: '#EDEDEF' }}>
              Create Account ✨
            </h1>
            <p className="text-sm" style={{ color: '#8A8F98' }}>Join CodeVerse and invite your friends</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-mono tracking-widest uppercase mb-2" style={{ color: '#8A8F98' }}>
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl text-white focus:outline-none transition-all duration-200"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'var(--border-accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-dim)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                  placeholder="john_doe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={loading}
                />
                <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#8A8F98' }} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-mono tracking-widest uppercase mb-2" style={{ color: '#8A8F98' }}>
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl text-white focus:outline-none transition-all duration-200"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'var(--border-accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-dim)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#8A8F98' }} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-mono tracking-widest uppercase mb-2" style={{ color: '#8A8F98' }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full pl-10 pr-11 py-2.5 text-sm rounded-xl text-white focus:outline-none transition-all duration-200"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'var(--border-accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-dim)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#8A8F98' }} />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-150 cursor-pointer border-0 bg-transparent"
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
              type="submit"
              className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 mt-2 text-white border-0 cursor-pointer transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, var(--accent), var(--info))',
                boxShadow: '0 4px 16px var(--accent-glow)',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px var(--accent-glow)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0px)'; e.currentTarget.style.boxShadow = '0 4px 16px var(--accent-glow)'; }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Creating Account…
                </>
              ) : (
                <> Sign Up <ArrowRight size={15} /> </>
              )}
            </button>
          </form>

          {/* Divider and Redirect */}
          <div className="mt-6 pt-6 text-center border-t border-solid" style={{ borderColor: 'var(--border)' }}>
            <p className="text-sm" style={{ color: '#8A8F98' }}>
              Already have an account?{' '}
              <a
                href="/"
                className="font-semibold transition-colors duration-150"
                style={{ color: '#818cf8' }}
                onMouseEnter={e => e.currentTarget.style.color = '#a5b4fc'}
                onMouseLeave={e => e.currentTarget.style.color = '#818cf8'}
              >
                Login
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs mt-6 font-mono" style={{ color: 'var(--fg-subtle)' }}>
          CodeVerse · Competitive Coding
        </p>
      </div>
    </div>
  );
};

export default Register;