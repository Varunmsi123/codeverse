import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Send, Trophy, Clock, ExternalLink, ShieldCheck } from 'lucide-react';

export default function ChallengePage() {
  const [friends, setFriends] = useState([]);
  const [leetcodeProblems, setLeetcodeProblems] = useState([]);
  const [sentChallenges, setSentChallenges] = useState([]);
  const [receivedChallenges, setReceivedChallenges] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('create');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [fr, pr, sr, rr] = await Promise.all([
        fetch('http://localhost:5000/challenge/friends', { headers }),
        fetch('http://localhost:5000/challenge/problems', { headers }),
        fetch('http://localhost:5000/challenge/sent', { headers }),
        fetch('http://localhost:5000/challenge/received', { headers }),
      ]);

      const [fd, pd, sd, rd] = await Promise.all([fr.json(), pr.json(), sr.json(), rr.json()]);

      if (fd.success) setFriends(fd.friends);
      if (pd.success) setLeetcodeProblems(pd.data);
      if (sd.success) setSentChallenges(sd.challenges.challengesSent);
      if (rd.success) setReceivedChallenges(rd.challenges.challengesReceived);
    } catch (error) { console.log('Fetch error:', error); }
    finally { setLoading(false); }
  };

  const toSlug = str => str.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');

  const handleVerify = async (name, challengeId) => {
    try {
      const token = localStorage.getItem('token');
      const challengeSlug = toSlug(name);
      const response = await fetch('http://localhost:5000/challenge/submissions', {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      const s = await response.json();
      const submissions = s?.submissions;
      const solved = submissions.some(sub =>
        sub.status === 10 && (sub.titleSlug.includes(challengeSlug) || challengeSlug.includes(sub.titleSlug))
      );

      if (solved) {
        await fetch(`http://localhost:5000/challenge/updateStatus/${challengeId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ status: 'solved' }),
        });
      }

      alert(solved ? '✅ Challenge solved!' : '❌ Not solved yet');
      return solved;
    } catch (error) { console.log('Verify error:', error); return false; }
  };

  const handleSendChallenge = async () => {
    if (!selectedFriend || !selectedProblem) { alert('Please select a friend and a problem'); return; }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/challenge/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ friendId: selectedFriend._id, problemId: selectedProblem.id, title: selectedProblem.title, difficulty: selectedProblem.difficulty }),
      });
      const data = await response.json();
      if (data.success) {
        alert('Challenge sent!');
        setSelectedFriend(null);
        setSelectedProblem(null);
        fetchData();
      }
    } catch (error) { console.log('Send challenge error:', error); }
  };

  const filteredProblems = leetcodeProblems.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const diffClass = (d = 'Easy') => ({ Easy: 'badge-easy', Medium: 'badge-medium', Hard: 'badge-hard' }[d] || 'badge-easy');
  const statusColor = (s) => ({
    pending: { bg: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: 'rgba(251,191,36,0.2)' },
    accepted: { bg: 'rgba(74,222,128,0.1)', color: '#4ade80', border: 'rgba(74,222,128,0.2)' },
    rejected: { bg: 'rgba(248,113,113,0.1)', color: '#f87171', border: 'rgba(248,113,113,0.2)' },
  }[s] || { bg: 'rgba(255,255,255,0.05)', color: '#8A8F98', border: 'rgba(255,255,255,0.1)' });

  const tabs = [
    { key: 'create', label: 'Create' },
    { key: 'sent', label: `Sent (${sentChallenges.length})` },
    { key: 'received', label: `Received (${receivedChallenges.length})` },
  ];

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#050506', color: '#EDEDEF' }}>
      {/* Ambient blobs */}
      <div className="blob-primary" />
      <div className="blob-secondary" />
      <div className="noise-overlay" />
      <div className="grid-overlay" />

      <div className="relative z-10">
        {/* Header */}
        <nav
          className="sticky top-0 z-50 flex items-center gap-4 px-4 sm:px-6 py-3"
          style={{ backgroundColor: 'rgba(5,5,6,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <button
            className="btn-ghost w-9 h-9 flex items-center justify-center rounded-lg shrink-0"
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={17} />
          </button>
          <div className="flex items-center gap-2.5">
            <Trophy size={18} color="#818cf8" />
            <h1 className="text-lg font-semibold tracking-tight" style={{ color: '#EDEDEF' }}>Challenges</h1>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

          {/* Tabs */}
          <div className="flex gap-1 mb-8 p-1 rounded-xl w-fit" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {tabs.map(({ key, label }) => (
              <button
                key={key}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={activeTab === key
                  ? { background: 'rgba(94,106,210,0.2)', color: '#818cf8', border: '1px solid rgba(94,106,210,0.3)' }
                  : { color: '#8A8F98', border: '1px solid transparent' }
                }
                onClick={() => setActiveTab(key)}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ── Create Tab ── */}
          {activeTab === 'create' && (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Friends */}
                <div className="surface-card rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold" style={{ color: '#EDEDEF' }}>Select Friend</h2>
                    <span className="text-xs font-mono" style={{ color: '#8A8F98' }}>{friends.length} friends</span>
                  </div>
                  <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
                    {friends.map(friend => (
                      <button
                        key={friend._id}
                        className="flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-150"
                        style={selectedFriend?._id === friend._id
                          ? { background: 'rgba(94,106,210,0.15)', border: '1px solid rgba(94,106,210,0.3)' }
                          : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }
                        }
                        onMouseEnter={e => { if (selectedFriend?._id !== friend._id) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                        onMouseLeave={e => { if (selectedFriend?._id !== friend._id) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                        onClick={() => setSelectedFriend(friend)}
                      >
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                          style={{ background: 'linear-gradient(135deg, #5E6AD2, #818cf8)', color: '#fff' }}
                        >
                          {friend.username[0].toUpperCase()}
                        </div>
                        <span className="text-sm font-medium" style={{ color: '#EDEDEF' }}>{friend.username}</span>
                      </button>
                    ))}
                    {friends.length === 0 && (
                      <div className="py-10 text-center text-sm" style={{ color: '#8A8F98' }}>No friends yet</div>
                    )}
                  </div>
                </div>

                {/* Problems */}
                <div className="surface-card rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold" style={{ color: '#EDEDEF' }}>Select Problem</h2>
                    <span className="text-xs font-mono" style={{ color: '#8A8F98' }}>{leetcodeProblems.length} problems</span>
                  </div>
                  <div className="relative mb-3">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#8A8F98' }} />
                    <input
                      type="text"
                      className="search-input w-full pl-9 pr-4 py-2 text-sm rounded-xl"
                      placeholder="Search problems…"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
                    {filteredProblems.map(problem => (
                      <button
                        key={problem.id}
                        className="flex items-center justify-between p-3 rounded-xl text-left transition-all duration-150"
                        style={selectedProblem?.id === problem.id
                          ? { background: 'rgba(94,106,210,0.15)', border: '1px solid rgba(94,106,210,0.3)' }
                          : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }
                        }
                        onMouseEnter={e => { if (selectedProblem?.id !== problem.id) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                        onMouseLeave={e => { if (selectedProblem?.id !== problem.id) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                        onClick={() => setSelectedProblem(problem)}
                      >
                        <div className="flex-1 min-w-0 mr-3">
                          <p className="text-xs font-mono mb-0.5" style={{ color: '#8A8F98' }}>#{problem.id}</p>
                          <p className="text-sm font-medium truncate" style={{ color: '#EDEDEF' }}>{problem.title}</p>
                        </div>
                        <span className={`${diffClass(problem.difficulty)} text-xs px-2.5 py-0.5 rounded-full font-semibold shrink-0`}>
                          {problem.difficulty}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Send section */}
              <div
                className="rounded-2xl p-6"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  {[
                    { label: 'Challenging', value: selectedFriend?.username || 'Select a friend' },
                    { label: 'Problem', value: selectedProblem?.title || 'Select a problem' },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex-1 rounded-xl px-4 py-3"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                    >
                      <p className="text-xs font-mono tracking-widest uppercase mb-1.5" style={{ color: '#8A8F98' }}>{label}</p>
                      <p className="text-sm font-semibold truncate" style={{ color: value.includes('Select') ? '#8A8F98' : '#EDEDEF' }}>{value}</p>
                    </div>
                  ))}
                </div>
                <button
                  className="btn-accent flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold mx-auto"
                  onClick={handleSendChallenge}
                  disabled={!selectedFriend || !selectedProblem}
                  style={(!selectedFriend || !selectedProblem) ? { opacity: 0.4, cursor: 'not-allowed' } : {}}
                >
                  <Send size={15} /> Send Challenge
                </button>
              </div>
            </div>
          )}

          {/* ── Sent Tab ── */}
          {activeTab === 'sent' && (
            <div className="surface-card rounded-2xl p-5">
              <h2 className="text-base font-semibold mb-5" style={{ color: '#EDEDEF' }}>Challenges You Sent</h2>
              {sentChallenges.length === 0 ? (
                <div className="flex flex-col items-center py-16 gap-3">
                  <Trophy size={36} style={{ color: '#8A8F98', opacity: 0.3 }} />
                  <p className="text-sm" style={{ color: '#8A8F98' }}>No challenges sent yet</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {sentChallenges.map(c => {
                    const sc = statusColor(c.status);
                    return (
                      <div key={c._id} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                              style={{ background: 'linear-gradient(135deg, #5E6AD2, #818cf8)', color: '#fff' }}>
                              {c.participants[1]?.userId?.username?.[0]?.toUpperCase()}
                            </div>
                            <span className="text-sm font-medium" style={{ color: '#8A8F98' }}>
                              To: <span style={{ color: '#EDEDEF' }}>{c.participants[1]?.userId?.username}</span>
                            </span>
                          </div>
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                            {c.status}
                          </span>
                        </div>
                        <p className="text-sm font-semibold mb-2 font-mono" style={{ color: '#EDEDEF' }}>{c.title}</p>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className={`${diffClass(c.difficulty)} text-xs px-2.5 py-0.5 rounded-full font-semibold`}>{c.difficulty}</span>
                          <span className="flex items-center gap-1 text-xs" style={{ color: '#8A8F98' }}>
                            <Clock size={12} /> {new Date(c.startTime).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── Received Tab ── */}
          {activeTab === 'received' && (
            <div className="surface-card rounded-2xl p-5">
              <h2 className="text-base font-semibold mb-5" style={{ color: '#EDEDEF' }}>Challenges You Received</h2>
              {receivedChallenges.length === 0 ? (
                <div className="flex flex-col items-center py-16 gap-3">
                  <Trophy size={36} style={{ color: '#8A8F98', opacity: 0.3 }} />
                  <p className="text-sm" style={{ color: '#8A8F98' }}>No challenges received yet</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {receivedChallenges.map(c => {
                    const sc = statusColor(c.status);
                    return (
                      <div key={c._id} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                              style={{ background: 'linear-gradient(135deg, #5E6AD2, #818cf8)', color: '#fff' }}>
                              {c.participants[1]?.userId?.username?.[0]?.toUpperCase()}
                            </div>
                            <span className="text-sm font-medium" style={{ color: '#8A8F98' }}>
                              From: <span style={{ color: '#EDEDEF' }}>{c.participants[0]?.userId?.username}</span>
                            </span>
                          </div>
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                            {c.status}
                          </span>
                        </div>
                        <p className="text-sm font-semibold mb-2 font-mono" style={{ color: '#EDEDEF' }}>{c.title}</p>
                        <div className="flex items-center gap-3 flex-wrap mb-3">
                          <span className={`${diffClass(c.difficulty)} text-xs px-2.5 py-0.5 rounded-full font-semibold`}>{c.difficulty}</span>
                          <span className="flex items-center gap-1 text-xs" style={{ color: '#8A8F98' }}>
                            <Clock size={11} /> {c.receivedAt || 'Unknown'}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <a
                            href={`https://leetcode.com/problems/${toSlug(c.title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150"
                            style={{ background: 'rgba(94,106,210,0.12)', color: '#818cf8', border: '1px solid rgba(94,106,210,0.2)', textDecoration: 'none' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(94,106,210,0.2)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(94,106,210,0.12)'}
                          >
                            <ExternalLink size={12} /> Open
                          </a>
                          <button
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150"
                            style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(74,222,128,0.18)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(74,222,128,0.1)'}
                            onClick={() => handleVerify(c.title,c._id)}
                          >
                            <ShieldCheck size={12} /> Verify
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}