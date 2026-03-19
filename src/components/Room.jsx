import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { Copy, Check, Play, Terminal, ChevronDown } from 'lucide-react';

let debounceTimer;

export default function Room() {
  const { roomid } = useParams();
  const [language, setLanguage] = useState('');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await fetch(`http://localhost:5000/room/${roomid}`);
        const data = await res.json();
        setLanguage(data.language);
        setCode(data.code || getDefaultCode(data.language));
      } catch (err) { console.error('Error fetching room data', err); }
    };
    fetchRoom();
  }, [roomid]);

  useEffect(() => {
    if (!code) return;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      try {
        await fetch(`http://localhost:5000/room/${roomid}/code`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });
      } catch (err) { console.error('Error saving code:', err); }
    }, 1000);
    return () => clearTimeout(debounceTimer);
  }, [code, roomid]);

  const getDefaultCode = (lang) => ({
    python: 'print("Hello, World!")',
    java: `public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}`,
    c: `#include <stdio.h>\nint main() {\n  printf("Hello, World!");\n  return 0;\n}`,
    cpp: `#include <iostream>\nint main() {\n  std::cout << "Hello, World!";\n  return 0;\n}`,
  }[lang] || '// Start coding…');

  const handleRun = async () => {
    setRunning(true);
    try {
      const res = await fetch('http://localhost:5000/room/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });
      const data = await res.json();
      setOutput(data.output);
    } catch (err) { setOutput('Error running code.'); }
    finally { setRunning(false); }
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const langColors = { python: '#3b82f6', java: '#f59e0b', c: '#8b5cf6', cpp: '#06b6d4', javascript: '#eab308' };
  const langColor = langColors[language] || '#818cf8';

  return (
    <div
      className="min-h-screen w-full flex flex-col relative"
      style={{ backgroundColor: '#050506', color: '#EDEDEF' }}
    >
      {/* Ambient */}
      <div className="blob-primary" style={{ opacity: 0.6 }} />
      <div className="noise-overlay" />
      <div className="grid-overlay" />

      <div className="relative z-10 flex flex-col min-h-screen">

        {/* ── Top Bar ── */}
        <nav
          className="flex items-center justify-between px-4 sm:px-6 py-3 shrink-0"
          style={{
            backgroundColor: 'rgba(5,5,6,0.9)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {/* Room info */}
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: 'rgba(94,106,210,0.15)', border: '1px solid rgba(94,106,210,0.25)' }}
            >
              <Terminal size={15} color="#818cf8" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-mono" style={{ color: '#8A8F98' }}>Room</p>
              <p className="text-sm font-semibold font-mono truncate" style={{ color: '#EDEDEF' }}>{roomid}</p>
            </div>
          </div>

          {/* Right: language badge + copy */}
          <div className="flex items-center gap-2 shrink-0">
            {language && (
              <span
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold"
                style={{ background: `${langColor}18`, color: langColor, border: `1px solid ${langColor}30` }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {language}
              </span>
            )}
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
              style={copied
                ? { background: 'rgba(74,222,128,0.12)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.25)' }
                : { background: 'rgba(255,255,255,0.05)', color: '#8A8F98', border: '1px solid rgba(255,255,255,0.08)' }
              }
              onClick={copyRoomId}
            >
              {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy ID</>}
            </button>
            <button
              className="btn-accent flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold"
              onClick={handleRun}
              disabled={running}
              style={running ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
            >
              {running ? (
                <div className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent animate-spin"
                  style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />
              ) : <Play size={12} fill="currentColor" />}
              {running ? 'Running…' : 'Run'}
            </button>
          </div>
        </nav>

        {/* ── Main split ── */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0">

          {/* Editor */}
          <div className="flex-1 flex flex-col min-h-0" style={{ minHeight: '300px' }}>
            {/* Editor toolbar */}
            <div
              className="flex items-center justify-between px-4 py-2 shrink-0"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(10,10,12,0.8)' }}
            >
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#f87171', opacity: 0.7 }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#fbbf24', opacity: 0.7 }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#4ade80', opacity: 0.7 }} />
                <span className="text-xs font-mono ml-2" style={{ color: '#8A8F98' }}>
                  {language ? `main.${language === 'python' ? 'py' : language === 'java' ? 'java' : language}` : 'untitled'}
                </span>
              </div>
              <span className="text-xs font-mono" style={{ color: '#8A8F98' }}>
                {code.split('\n').length} lines
              </span>
            </div>

            <div className="flex-1" style={{ minHeight: '300px' }}>
              <Editor
                height="100%"
                language={language || 'javascript'}
                value={code}
                onChange={value => setCode(value)}
                theme="vs-dark"
                options={{
                  fontFamily: '"Geist Mono", "Fira Code", monospace',
                  fontSize: 14,
                  lineHeight: 1.7,
                  padding: { top: 16, bottom: 16 },
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  renderLineHighlight: 'gutter',
                  smoothScrolling: true,
                  cursorBlinking: 'smooth',
                  cursorSmoothCaretAnimation: 'on',
                  bracketPairColorization: { enabled: true },
                }}
              />
            </div>
          </div>

          {/* Output panel */}
          <div
            className="w-full lg:w-80 xl:w-96 flex flex-col shrink-0"
            style={{ borderLeft: '1px solid rgba(255,255,255,0.05)', borderTop: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div
              className="flex items-center gap-2 px-4 py-3 shrink-0"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(10,10,12,0.8)' }}
            >
              <Terminal size={14} color="#818cf8" />
              <span className="text-xs font-mono font-semibold" style={{ color: '#EDEDEF' }}>Output</span>
              {output && (
                <span
                  className="ml-auto text-xs px-2 py-0.5 rounded-full font-mono"
                  style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' }}
                >
                  done
                </span>
              )}
            </div>

            <div
              className="flex-1 p-4 font-mono text-sm leading-relaxed overflow-auto"
              style={{
                background: '#020203',
                color: output ? '#EDEDEF' : '#8A8F98',
                minHeight: '200px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {running ? (
                <div className="flex items-center gap-2" style={{ color: '#818cf8' }}>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent animate-spin"
                    style={{ borderColor: 'rgba(94,106,210,0.3)', borderTopColor: '#5E6AD2' }} />
                  <span className="text-xs">Executing…</span>
                </div>
              ) : output || '// Run your code to see output…'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}