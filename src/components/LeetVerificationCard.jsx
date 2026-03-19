import React, { useState } from 'react';
import { X, CheckCircle, Copy, Check, ShieldCheck } from 'lucide-react';

export default function LeetCodeVerification({ onClose, verificationCode, userId }) {
  const [leetcodeUsername, setLeetcodeUsername] = useState('');
  const [isVerified]   = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError]   = useState('');

  const handleCopyCode = () => {
    navigator.clipboard.writeText(verificationCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = async () => {
    if (!leetcodeUsername.trim()) { setError('Please enter your LeetCode username.'); return; }
    setIsVerifying(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res   = await fetch('http://localhost:5000/users/verifyleet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId, leetUsername: leetcodeUsername }),
      });
      const data = await res.json();
      alert(data.msg || data.message);
      if (data?.message === 'You are already verified on LeetCode!') onClose();
    } catch (e) { setError('Verification failed. Please try again.'); }
    finally { setIsVerifying(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}>
      <div className="relative w-full max-w-md rounded-2xl overflow-hidden animate-fade-up"
        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 24px 64px rgba(0,0,0,0.8)' }}
        onClick={e => e.stopPropagation()}>

        {/* Close */}
        <button className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--fg-muted)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-hover)'; e.currentTarget.style.color = 'var(--fg)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)';       e.currentTarget.style.color = 'var(--fg-muted)'; }}
          onClick={onClose}><X size={14} /></button>

        {/* Header */}
        <div className="px-6 py-6 text-center" style={{ borderBottom: '1px solid var(--border)', background: 'linear-gradient(180deg, rgba(251,191,36,0.05) 0%, transparent 100%)' }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(251,191,36,0.10)', border: '1px solid rgba(251,191,36,0.25)', boxShadow: '0 0 30px rgba(251,191,36,0.08)' }}>
            <span className="text-3xl">💻</span>
          </div>
          <h2 className="text-xl font-semibold mb-1" style={{ color: 'var(--fg)' }}>LeetCode Verification</h2>
          <p className="text-sm" style={{ color: 'var(--fg-muted)' }}>
            {isVerified ? 'Your account is verified' : 'Link your LeetCode profile to track stats'}
          </p>
        </div>

        {/* Body */}
        <div className="p-6">
          {isVerified ? (
            <div className="flex flex-col items-center py-8 gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)' }}>
                <CheckCircle size={32} style={{ color: 'var(--success)' }} />
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold" style={{ color: 'var(--success)' }}>Verified!</p>
                <p className="text-sm mt-1 font-mono" style={{ color: 'var(--fg-muted)' }}>Account linked successfully</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Username field */}
              <div>
                <label className="block text-xs font-mono tracking-widest uppercase mb-2" style={{ color: 'var(--fg-muted)' }}>
                  LeetCode Username
                </label>
                <input type="text"
                  className="w-full px-4 py-3 text-sm rounded-xl focus:outline-none transition-all"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--fg)' }}
                  placeholder="your-leetcode-username"
                  value={leetcodeUsername}
                  onChange={e => { setLeetcodeUsername(e.target.value); setError(''); }}
                  onFocus={e => { e.target.style.borderColor = 'var(--border-accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-dim)'; }}
                  onBlur={e  => { e.target.style.borderColor = 'var(--border)';        e.target.style.boxShadow = 'none'; }}
                />
              </div>

              {/* Verification code box */}
              <div className="rounded-xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <p className="text-xs font-mono tracking-widest uppercase mb-3" style={{ color: 'var(--fg-muted)' }}>
                  Verification Code
                </p>
                <div className="flex items-center justify-between rounded-xl px-4 py-3 mb-3"
                  style={{ background: 'var(--bg-deep)', border: '1px solid var(--border)' }}>
                  <code className="text-sm font-mono font-semibold" style={{ color: 'var(--warning)' }}>{verificationCode}</code>
                  <button
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
                    style={copied
                      ? { background: 'rgba(74,222,128,0.10)', color: 'var(--success)', border: '1px solid rgba(74,222,128,0.25)' }
                      : { background: 'var(--surface-hover)', color: 'var(--fg-muted)', border: '1px solid var(--border)' }}
                    onClick={handleCopyCode}>
                    {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                  </button>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
                  📝 Paste this code in your LeetCode bio, then click Verify below.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', color: 'var(--danger)' }}>
                  {error}
                </div>
              )}

              {/* CTA */}
              <button
                className="w-full py-3 text-sm font-semibold flex items-center justify-center gap-2 rounded-xl text-white transition-all duration-200 hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
                style={{ background: 'var(--accent)', boxShadow: '0 0 0 1px var(--border-accent), 0 4px 12px var(--accent-glow)' }}
                onMouseEnter={e => { if (!isVerifying) e.currentTarget.style.background = 'var(--accent-bright)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)'; }}
                onClick={handleVerify}
                disabled={isVerifying}>
                <ShieldCheck size={16} />
                {isVerifying ? 'Verifying…' : 'Verify Account'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}