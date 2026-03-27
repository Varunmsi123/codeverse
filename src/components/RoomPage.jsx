import { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import CollaborativeEditor from './CollaborativeEditor';
import { Copy, Play, Users, CheckCheck, Loader2, Code2 } from 'lucide-react';

export default function RoomPage() {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const [room, setRoom] = useState(null);
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [language, setLanguage] = useState(searchParams.get('lang') || 'javascript');
  const [outputOpen, setOutputOpen] = useState(false);
  const username = localStorage.getItem('username');
  const codeRef = useRef('');

  useEffect(() => {
    const fetchRoom = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/room/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setRoom(data.room);
        setLanguage(data.room.language || language);
      }
    };
    fetchRoom();
  }, [roomId]);

  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRun = async () => {
    setRunning(true);
    setOutput('');
    setOutputOpen(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/room/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ code: codeRef.current, language }),
      });
      const data = await res.json();
      setOutput(data.output || 'No output');
    } catch (err) {
      setOutput('Error running code');
    } finally {
      setRunning(false);
    }
  };

  if (!room) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#060608', flexDirection: 'column', gap: '16px' }}>
      <div style={{ position: 'relative', width: '48px', height: '48px' }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: '2px solid transparent',
          borderTopColor: '#6366f1',
          animation: 'spin 0.8s linear infinite',
        }} />
        <Code2 size={20} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', color: '#6366f1' }} />
      </div>
      <span style={{ color: '#4B5563', fontSize: '13px', letterSpacing: '0.05em' }}>Connecting to room...</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#060608', color: '#E8E9F0', fontFamily: "'JetBrains Mono', 'Fira Code', monospace", overflow: 'hidden' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        .run-btn:hover { background: rgba(99,102,241,0.25) !important; transform: translateY(-1px); box-shadow: 0 4px 20px rgba(99,102,241,0.3) !important; }
        .run-btn:active { transform: translateY(0px); }
        .copy-btn:hover { background: rgba(255,255,255,0.08) !important; color: #E8E9F0 !important; }
      `}</style>

      {/* ── Navbar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', height: '56px', flexShrink: 0,
        background: 'rgba(255,255,255,0.02)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(12px)',
      }}>

        {/* Left — Logo + Room Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '30px', height: '30px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 16px rgba(99,102,241,0.4)',
            }}>
              <Code2 size={15} color="#fff" />
            </div>
            <span style={{ fontSize: '18px', fontWeight: '600', color: '#E8E9F0', letterSpacing: '-0.02em' }}>
              {room.roomName || 'Untitled Room'}
            </span>
          </div>

          {/* Live indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '3px 10px', borderRadius: '20px', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.15)' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: '10px', color: '#4ade80', fontWeight: '500', letterSpacing: '0.08em' }}>LIVE</span>
          </div>
        </div>

        {/* Center — Room ID copy */}
        <button
          className="copy-btn"
          onClick={handleCopyRoomId}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '6px 14px', borderRadius: '8px', cursor: 'pointer',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            color: '#6B7280', fontSize: '11px', transition: 'all 0.15s',
            fontFamily: 'inherit',
          }}
        >
          {copied ? <CheckCheck size={12} color="#4ade80" /> : <Copy size={12} />}
          <span style={{ color: copied ? '#4ade80' : '#9CA3AF' }}>
            {copied ? 'Copied!' : roomId.slice(0, 8) + '···' + roomId.slice(-6)}
          </span>
          {!copied && <span style={{ color: '#374151', fontSize: '10px' }}>click to copy</span>}
        </button>

        {/* Right — Members + Run */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

          {/* Members */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 12px', borderRadius: '8px',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            color: '#6B7280', fontSize: '12px',
          }}>
            <Users size={12} />
            <span>{room.members?.length || 1}</span>
          </div>

          {/* Run button */}
          <button
            className="run-btn"
            onClick={handleRun}
            disabled={running}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '7px 18px', borderRadius: '8px', cursor: running ? 'not-allowed' : 'pointer',
              background: running ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.15)',
              border: '1px solid rgba(99,102,241,0.3)',
              color: running ? 'rgba(99,102,241,0.5)' : '#818cf8',
              fontSize: '12px', fontWeight: '600', transition: 'all 0.2s',
              fontFamily: 'inherit', letterSpacing: '0.03em',
              boxShadow: running ? 'none' : '0 2px 12px rgba(99,102,241,0.15)',
            }}
          >
            {running
              ? <><Loader2 size={13} style={{ animation: 'spin 0.8s linear infinite' }} /> Running</>
              : <><Play size={13} /> Run Code</>
            }
          </button>
        </div>
      </div>

      {/* ── Editor + Output ── */}
      <div style={{ display: 'flex', flex: 1, flexDirection: 'column', overflow: 'hidden' }}>

        {/* Editor */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <CollaborativeEditor
            roomId={roomId}
            username={username}
            language={language}
            onCodeChange={(code) => { codeRef.current = code; }}
          />
        </div>

        {/* Output Panel */}
        {outputOpen && (
          <div style={{
            flexShrink: 0, height: '200px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            background: '#08090c',
            display: 'flex', flexDirection: 'column',
            animation: 'fadeIn 0.2s ease',
          }}>
            {/* Output header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: running ? '#fbbf24' : '#4ade80', animation: running ? 'pulse 1s infinite' : 'none' }} />
                <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: '500', letterSpacing: '0.08em' }}>
                  {running ? 'RUNNING...' : 'OUTPUT'}
                </span>
              </div>
              <button
                onClick={() => { setOutputOpen(false); setOutput(''); }}
                style={{ background: 'none', border: 'none', color: '#4B5563', cursor: 'pointer', fontSize: '18px', lineHeight: 1, padding: '0 2px' }}
              >
                ×
              </button>
            </div>

            {/* Output content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
              {running ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6B7280' }}>
                  <Loader2 size={13} style={{ animation: 'spin 0.8s linear infinite' }} />
                  <span style={{ fontSize: '13px' }}>Executing code...</span>
                </div>
              ) : (
                <pre style={{
                  fontSize: '13px',
                  color: output.toLowerCase().includes('error') ? '#f87171' : '#4ade80',
                  fontFamily: 'inherit', whiteSpace: 'pre-wrap', margin: 0, lineHeight: 1.6,
                }}>
                  {output || 'No output'}
                </pre>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}