import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code, ArrowLeft, Users, Loader2, AlertCircle } from "lucide-react";
import { API_URL } from '../config';

const JoinRoom = () => {
  const [roomId, setRoomId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleJoin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/room/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ roomId, password }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.msg || 'Failed to join room');
      }

      localStorage.setItem("roomId", data.roomId);
      localStorage.setItem("language", data.language);
      navigate(`/room/${data.roomId}`);

    } catch (err) {
      setError(err.message || "Failed to join room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient backgrounds */}
      <div className="blob-primary" />
      <div className="blob-secondary" />
      <div className="blob-tertiary" />
      <div className="noise-overlay" />
      <div className="grid-overlay" />

      {/* Back button */}
      <button 
        onClick={() => navigate('/home')}
        className="absolute top-6 left-6 z-20 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          color: 'var(--fg-muted)',
          cursor: 'pointer'
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-hover)'; e.currentTarget.style.color = 'var(--fg)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'; e.currentTarget.style.color = 'var(--fg-muted)'; }}
      >
        <ArrowLeft size={16} />
      </button>

      <div className="relative z-10 w-full max-w-sm animate-fade-up">
        {/* Brand header */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: 'var(--accent-dim)',
              border: '1px solid var(--border-accent)',
              boxShadow: '0 0 20px var(--accent-glow)',
            }}
          >
            <Code size={16} style={{ color: 'var(--info)' }} />
          </div>
          <span className="text-lg font-semibold tracking-tight" style={{ color: '#EDEDEF' }}>
            Code<span style={{ color: 'var(--info)' }}>Verse</span>
          </span>
        </div>

        {/* Form Card */}
        <div
          className="rounded-2xl p-7 sm:p-8"
          style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
            border: '1px solid var(--border)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.7)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight mb-1 flex items-center gap-2" style={{ color: '#EDEDEF' }}>
              Join Room <Users size={18} style={{ color: 'var(--info)' }} />
            </h1>
            <p className="text-xs" style={{ color: 'var(--fg-muted)' }}>Enter the room ID and password to participate</p>
          </div>

          {error && (
            <div 
              className="flex items-center gap-2 p-3 rounded-xl mb-4 text-xs font-medium" 
              style={{ 
                background: 'rgba(248,113,113,0.1)', 
                border: '1px solid rgba(248,113,113,0.2)', 
                color: 'var(--danger)' 
              }}
            >
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleJoin} className="flex flex-col gap-4">
            {/* Room ID */}
            <div>
              <label className="block text-xs font-mono tracking-widest uppercase mb-1.5" style={{ color: 'var(--fg-muted)' }}>
                Room ID
              </label>
              <input
                type="text"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl text-white focus:outline-none transition-all duration-200"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                }}
                onFocus={e => { e.target.style.borderColor = 'var(--border-accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-dim)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                placeholder="Enter UUID Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-mono tracking-widest uppercase mb-1.5" style={{ color: 'var(--fg-muted)' }}>
                Room Password
              </label>
              <input
                type="password"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl text-white focus:outline-none transition-all duration-200"
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
            </div>

            {/* Submit Button */}
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
                  Joining Room…
                </>
              ) : (
                "Join Room"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JoinRoom;