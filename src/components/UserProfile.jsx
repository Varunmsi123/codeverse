import React, { useState, useEffect } from 'react';
import { X, Users, Award, CheckCircle, Code, UserPlus, UserCheck } from 'lucide-react';

export default function UserProfile({ onClose, ReceiverID }) {
  const [userProfile,  setUserProfile]  = useState(null);
  const [userProfile1, setUserProfile1] = useState(null);
  const [loading, setLoading]           = useState(true);
  const [isFriend, setIsFriend]         = useState(false);
  const [friendRequestSent, setFriendRequestSent] = useState(false);
  const [formateddate, setFormateddate] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('token');
        const id    = ReceiverID?._id || ReceiverID;
        const res   = await fetch(`http://localhost:5000/users/profile/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) return;
        const data  = await res.json();
        setUserProfile1(data);
      } catch (e) { console.log('Error fetching user:', e); }
      finally { setLoading(false); }
    };
    if (ReceiverID) load();
  }, [ReceiverID]);

  useEffect(() => {
    if (!userProfile1?.user) return;
    const u = userProfile1.user;
    setUserProfile({
      username: u.username,
      leetcodeUsername: u.leetcodeUsername,
      problemsSolved: u.totalProblemsSolved,
      challengesCompleted: u.challengesReceived?.length,
      friendsCount: u.friends?.length ?? 0,
      bio: u.bio || 'Passionate about algorithms and competitive programming',
      createdAt: u.createdAt,
    });
  }, [userProfile1]);

  useEffect(() => {
    if (userProfile?.createdAt)
      setFormateddate(new Date(userProfile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }));
  }, [userProfile]);

  const handleAddFriend = async () => {
    try {
      const token = localStorage.getItem('token');
      const uid   = localStorage.getItem('userID');
      await fetch('http://localhost:5000/users/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ UserID: uid, receiverID: ReceiverID?._id || ReceiverID }),
      });
      setFriendRequestSent(true);
      setTimeout(() => alert('Friend request sent!'), 150);
    } catch (e) { console.error('Error adding friend:', e); }
  };

  const stats = [
    { icon: Code,        label: 'Problems Solved', value: userProfile?.problemsSolved ?? '—',      color: 'var(--info)',    bg: 'var(--accent-dim)',           border: 'var(--border-accent)' },
    { icon: CheckCircle, label: 'Challenges',       value: userProfile?.challengesCompleted ?? '—', color: 'var(--success)', bg: 'rgba(74,222,128,0.10)',       border: 'rgba(74,222,128,0.20)' },
    { icon: Users,       label: 'Friends',           value: userProfile?.friendsCount ?? '—',        color: '#a78bfa',        bg: 'rgba(167,139,250,0.10)',       border: 'rgba(167,139,250,0.20)' },
    { icon: Award,       label: 'Success Rate',
      value: userProfile?.problemsSolved ? `${Math.round((userProfile.challengesCompleted / userProfile.problemsSolved) * 100)}%` : '0%',
      color: 'var(--warning)', bg: 'rgba(251,191,36,0.10)', border: 'rgba(251,191,36,0.20)' },
  ];

  if (loading) return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'var(--accent-dim)', borderTopColor: 'var(--accent)' }} />
        <p className="text-xs font-mono tracking-widest uppercase" style={{ color: 'var(--fg-muted)' }}>Loading</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
      style={{ background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
      onClick={onClose}>
      <div className="relative w-full max-w-lg rounded-2xl overflow-hidden animate-fade-up max-h-[90vh] overflow-y-auto"
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 32px 80px rgba(0,0,0,0.85)',
        }}
        onClick={e => e.stopPropagation()}>

        {/* Close */}
        <button className="absolute top-4 right-4 z-20 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--fg-muted)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-hover)'; e.currentTarget.style.color = 'var(--fg)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)';       e.currentTarget.style.color = 'var(--fg-muted)'; }}
          onClick={onClose}>
          <X size={14} />
        </button>

        {/* Header */}
        <div className="px-5 sm:px-6 pt-10 pb-6 text-center"
          style={{ borderBottom: '1px solid var(--border)', background: 'linear-gradient(180deg, var(--accent-dim) 0%, transparent 100%)' }}>
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl sm:text-3xl font-bold text-white"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--info))', boxShadow: '0 0 0 3px var(--accent-dim), 0 8px 24px var(--accent-glow)' }}>
            {userProfile?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold mb-1 tracking-tight" style={{ color: 'var(--fg)' }}>{userProfile?.username || '—'}</h1>
          <p className="text-sm leading-relaxed mb-3 mx-auto max-w-xs" style={{ color: 'var(--fg-muted)' }}>{userProfile?.bio}</p>
          {formateddate && <p className="text-xs font-mono mb-5" style={{ color: 'var(--fg-muted)' }}>📅 Joined {formateddate}</p>}

          {isFriend ? (
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold"
              style={{ background: 'rgba(74,222,128,0.1)', color: 'var(--success)', border: '1px solid rgba(74,222,128,0.2)' }}>
              <UserCheck size={15} /> Friends
            </span>
          ) : friendRequestSent ? (
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold"
              style={{ background: 'var(--surface)', color: 'var(--fg-muted)', border: '1px solid var(--border)' }}>
              <UserCheck size={15} /> Request Sent
            </span>
          ) : (
            <button className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all duration-200 hover:-translate-y-px"
              style={{ background: 'var(--accent)', boxShadow: '0 0 0 1px var(--border-accent), 0 4px 12px var(--accent-glow)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-bright)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}
              onClick={handleAddFriend}>
              <UserPlus size={15} /> Add Friend
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="p-5 sm:p-6">
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mb-5">
            {stats.map(({ icon: Icon, label, value, color, bg, border }) => (
              <div key={label}
                className="p-3.5 sm:p-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-hover)'; e.currentTarget.style.borderColor = 'var(--border-hover)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)';       e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center"
                    style={{ background: bg, border: `1px solid ${border}` }}>
                    <Icon size={13} style={{ color }} />
                  </div>
                  <span className="text-xs" style={{ color: 'var(--fg-muted)' }}>{label}</span>
                </div>
                <p className="text-xl sm:text-2xl font-semibold tracking-tight" style={{ color: 'var(--fg)' }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Coding profile */}
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
            <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
              <Code size={14} style={{ color: 'var(--info)' }} />
              <h2 className="text-sm font-semibold" style={{ color: 'var(--fg)' }}>Coding Profile</h2>
            </div>
            {[
              {
                label: 'LeetCode',
                value: userProfile?.leetcodeUsername
                  ? <a href={`https://leetcode.com/${userProfile.leetcodeUsername}`} target="_blank" rel="noopener noreferrer"
                      className="font-mono hover:underline" style={{ color: 'var(--warning)' }}>@{userProfile.leetcodeUsername}</a>
                  : <span style={{ color: 'var(--fg-muted)' }}>—</span>,
              },
              { label: 'Total Problems', value: userProfile?.problemsSolved ?? '—' },
            ].map(({ label, value }, i, arr) => (
              <div key={label} className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <span className="text-xs" style={{ color: 'var(--fg-muted)' }}>{label}</span>
                <span className="text-sm font-medium" style={{ color: 'var(--fg)' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}