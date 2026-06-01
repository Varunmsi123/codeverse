import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Code, ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import { API_URL } from "../config";

const CreateRoom = () => {
  const [roomName, setRoomName] = useState('');
  const [password, setPassword] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!roomName || !password || !language) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/room/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          roomName,
          password,
          language,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Something went wrong");
      }

      navigate(`/room/${data.roomId}?lang=${language}`);

    } catch (err) {
      console.error("Create room error:", err.message);
      alert(err.message || "Something went wrong. Try again.");
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
              Create Room <Sparkles size={16} style={{ color: 'var(--warning)' }} />
            </h1>
            <p className="text-xs" style={{ color: 'var(--fg-muted)' }}>Set up a collaborative room for coding challenges</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Room Name */}
            <div>
              <label className="block text-xs font-mono tracking-widest uppercase mb-1.5" style={{ color: 'var(--fg-muted)' }}>
                Room Name
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
                placeholder="My Awesome Room"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
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

            {/* Language Selection */}
            <div>
              <label className="block text-xs font-mono tracking-widest uppercase mb-1.5" style={{ color: 'var(--fg-muted)' }}>
                Default Language
              </label>
              <select
                className="w-full px-3.5 py-2.5 text-sm rounded-xl text-white focus:outline-none transition-all duration-200 cursor-pointer"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                }}
                onFocus={e => { e.target.style.borderColor = 'var(--border-accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-dim)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                required
                disabled={loading}
              >
                <option value="javascript" style={{ background: '#0a0a0c' }}>JavaScript</option>
                <option value="python" style={{ background: '#0a0a0c' }}>Python</option>
                <option value="java" style={{ background: '#0a0a0c' }}>Java</option>
                <option value="cpp" style={{ background: '#0a0a0c' }}>C++</option>
                <option value="c" style={{ background: '#0a0a0c' }}>C</option>
              </select>
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
                  Creating Room…
                </>
              ) : (
                "Create Room"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;