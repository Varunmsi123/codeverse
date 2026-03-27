import React, { useState, useEffect } from 'react';
import { Search, Bell, Code, Users, Zap, Plus, ChevronDown, ChevronUp, LogOut, User, ShieldCheck } from 'lucide-react';
import UserProfile from './UserProfile';
import LeetCodeVerification from './LeetVerificationCard';
import Notifications from './Notifications';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllRooms, setShowAllRooms] = useState(false);
  const [showAllChallenges, setShowAllChallenges] = useState(false);
  const [realUsers, setRealUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [showLeetVerificationCard, setShowLeetVerificationCard] = useState(false);
  const [verificationCode, setVerificationCode] = useState(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [myRooms, setMyRooms] = useState([]);
  const [myChallenges, setMyChallenges] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyRooms = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/room/my-rooms', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setMyRooms(data.rooms);
      } catch (err) {
        console.log('Fetch my rooms error:', err);
      }
    };

    fetchMyRooms();
  }, []);

 useEffect(() => {
  const fetchChallenges = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/challenge/home-challenges', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setMyChallenges(data.challenges);
    } catch (err) {
      console.log('Fetch challenges error:', err);
    }
  };
  fetchChallenges();
}, []);

  const displayedRooms = showAllRooms ? myRooms : myRooms.slice(0, 2);
  const displayedChallenges = showAllChallenges ? myChallenges : myChallenges.slice(0, 2);
  const activeRoomsCount = myRooms.length;
  const pendingChallengesCount = myChallenges.filter(c => c.status === 'Pending').length;

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/auth/me', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) setUser(data.user);
      else alert('Session expired. Please login again.');
    } catch (e) { console.log('Profile Error:', e); }
    setLoading(false);
  };

  const searchUsers = async (query) => {
    if (!query.trim()) { setRealUsers([]); return; }
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/users/search?username=${query}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setRealUsers(data.users);
    } catch (e) { console.log('Search Error:', e); }
  };

  const fetchOtherUserProfile = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/users/profile/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) { setSelectedUser(data.user); setShowProfileCard(true); }
    } catch (e) { console.log('Error fetching user:', e); }
  };

  const handleLeetCodeVerification = async () => {
    try {
      const token = localStorage.getItem('token');
      const UserID = localStorage.getItem('userID');
      const res = await fetch('http://localhost:5000/users/leetVerification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId: UserID }),
      });
      const data = await res.json();
      if (data.success) setVerificationCode(data.code);
      else { alert(data.message); if (data?.message === 'You are already verified on LeetCode!') window.location.reload(); }
    } catch (e) { console.log('Verification Error:', e); }
  };

  const handleLeetVerification = () => { setSelectedUser(localStorage.getItem('userID')); handleLeetCodeVerification(); setShowLeetVerificationCard(true); setShowProfileDropdown(false); };
  const handleLogout = () => { localStorage.removeItem('token'); window.location.href = '/login'; };
  const handleViewProfile = () => { setShowProfileDropdown(false); setSelectedUser(user); setShowProfileCard(true); };
  const handleSuggestionClick = (uid) => { setSearchQuery(''); setRealUsers([]); setMobileSearchOpen(false); fetchOtherUserProfile(uid); };
  const closeProfile = () => { setShowProfileCard(false); setSelectedUser(null); };
  const closeNotifications = () => setShowNotifications(false);
  const closeLeetVerification = () => { setShowLeetVerificationCard(false); setSelectedUser(null); };

  useEffect(() => { fetchProfile(); }, []);
  useEffect(() => {
    const h = () => { setShowProfileDropdown(false); setShowNotifications(false); };
    document.addEventListener('click', h);
    return () => document.removeEventListener('click', h);
  }, []);

  // Badge color via CSS var tokens
  const diffStyle = (d) => ({
    Easy: { background: 'rgba(74,222,128,0.10)', color: 'var(--success)' },
    Medium: { background: 'rgba(251,191,36,0.10)', color: 'var(--warning)' },
    Hard: { background: 'rgba(248,113,113,0.10)', color: 'var(--danger)' },
  }[d] || { background: 'rgba(74,222,128,0.10)', color: 'var(--success)' });

  const statusStyle = (s) => s === 'Completed'
    ? { background: 'rgba(94,106,210,0.15)', color: 'var(--info)' }
    : { background: 'rgba(251,191,36,0.10)', color: 'var(--warning)' };

  // Reusable search results dropdown
  const SearchResults = () => searchQuery && realUsers.length > 0 ? (
    <div className="absolute top-full mt-2 left-0 right-0 z-[200] rounded-xl overflow-hidden"
      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', boxShadow: '0 16px 48px rgba(0,0,0,0.7)' }}>
      {realUsers.map(u => (
        <button key={u._id}
          className="w-full text-left px-3 py-2.5 text-sm flex items-center gap-2.5 transition-colors duration-150"
          style={{ color: 'var(--fg)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          onClick={() => handleSuggestionClick(u._id)}
        >
          <span className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-semibold shrink-0"
            style={{ background: 'var(--accent-dim)', color: 'var(--info)' }}>
            {u.username?.[0]?.toUpperCase()}
          </span>
          {u.username}
        </button>
      ))}
    </div>
  ) : null;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'var(--accent-dim)', borderTopColor: 'var(--accent)' }} />
        <p className="text-sm tracking-widest font-mono uppercase" style={{ color: 'var(--fg-muted)' }}>Loading</p>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen" style={{ background: 'var(--bg)', color: 'var(--fg)' }}>
      {/* Ambient */}
      <div className="blob-primary" /><div className="blob-secondary" />
      <div className="blob-tertiary" /><div className="blob-bottom" />
      <div className="noise-overlay" /><div className="grid-overlay" />

      {/* Modals at root — always full-screen centered */}
      {showProfileCard && selectedUser && <UserProfile user={user} onClose={closeProfile} ReceiverID={selectedUser} />}
      {showLeetVerificationCard && <LeetCodeVerification onClose={closeLeetVerification} verificationCode={verificationCode} userId={selectedUser} />}
      {showNotifications && <Notifications onClose={closeNotifications} />}

      <div className="relative z-10">
        {/* ═══ NAVBAR ═══ */}
        <nav
          className="sticky top-0 z-40 px-4 sm:px-6"
          style={{
            background: 'rgba(5,5,6,0.88)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderBottom: '1px solid var(--border)',
          }}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between gap-3 h-14">
            {/* Brand */}
            <a href="#" className="flex items-center gap-2.5 shrink-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', boxShadow: '0 0 20px var(--accent-glow)' }}>
                <Code size={16} style={{ color: 'var(--info)' }} />
              </div>
              <span className="font-semibold text-base sm:text-lg tracking-tight" style={{ color: 'var(--fg)' }}>
                Code<span style={{ color: 'var(--info)' }}>Verse</span>
              </span>
            </a>

            {/* Desktop search */}
            <div className="relative flex-1 max-w-xs sm:max-w-sm md:max-w-md hidden sm:block">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--fg-muted)' }} />
              <input type="text"
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl transition-all duration-200 focus:outline-none"
                style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  color: 'var(--fg)',
                }}
                onFocus={e => { e.target.style.borderColor = 'var(--border-accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-dim)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                placeholder="Search users…"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); searchUsers(e.target.value); }}
              />
              <SearchResults />
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Mobile search toggle */}
              <button className="sm:hidden w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--fg)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--surface)'}
                onClick={() => setMobileSearchOpen(v => !v)}>
                <Search size={15} />
              </button>

              {/* Bell */}
              <div className="relative" onClick={e => e.stopPropagation()}>
                <button className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg transition-colors"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--fg)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--surface)'}
                  onClick={() => setShowNotifications(v => !v)}>
                  <Bell size={15} />
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center font-bold"
                    style={{ background: 'var(--accent)', color: '#fff', fontSize: 9 }}>3</span>
                </button>
              </div>

              {/* Profile */}
              <div className="relative flex items-center gap-2" onClick={e => e.stopPropagation()}>
                <span className="text-sm font-medium hidden md:block" style={{ color: 'var(--fg-muted)' }}>{user?.username || 'Developer'}</span>
                <button
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white transition-all duration-200 hover:-translate-y-px"
                  style={{ background: 'linear-gradient(135deg, var(--accent), var(--info))', boxShadow: '0 0 0 1px var(--border-accent), 0 4px 12px var(--accent-glow)' }}
                  onClick={() => setShowProfileDropdown(v => !v)}>
                  {user?.username?.[0]?.toUpperCase() || 'D'}
                </button>

                {showProfileDropdown && (
                  <div className="absolute top-11 right-0 min-w-[200px] py-1.5 rounded-xl z-[100] animate-slide-down overflow-hidden"
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', boxShadow: '0 16px 48px rgba(0,0,0,0.7)' }}>
                    <div className="px-3 py-2.5" style={{ borderBottom: '1px solid var(--border)' }}>
                      <p className="text-sm font-semibold" style={{ color: 'var(--fg)' }}>{user?.username || 'Developer'}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--fg-muted)' }}>Signed in</p>
                    </div>
                    {[
                      { icon: User, label: 'View Profile', action: handleViewProfile },
                      { icon: ShieldCheck, label: 'Verify LeetCode', action: handleLeetVerification },
                    ].map(({ icon: Icon, label, action }) => (
                      <button key={label}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-all duration-150"
                        style={{ color: 'var(--fg-muted)' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-hover)'; e.currentTarget.style.color = 'var(--fg)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--fg-muted)'; }}
                        onClick={action}>
                        <Icon size={14} /> {label}
                      </button>
                    ))}
                    <div style={{ borderTop: '1px solid var(--border)', marginTop: 4, paddingTop: 4 }}>
                      <button className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-all duration-150"
                        style={{ color: 'var(--danger)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.07)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        onClick={handleLogout}>
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile search bar */}
          {mobileSearchOpen && (
            <div className="sm:hidden pb-3 relative">
              <Search size={14} className="absolute left-3 top-[13px] pointer-events-none" style={{ color: 'var(--fg-muted)' }} />
              <input type="text" autoFocus
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl focus:outline-none transition-all"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--fg)' }}
                onFocus={e => { e.target.style.borderColor = 'var(--border-accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-dim)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                placeholder="Search users…"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); searchUsers(e.target.value); }}
              />
              <SearchResults />
            </div>
          )}
        </nav>

        {/* ═══ MAIN ═══ */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

          {/* Welcome */}
          <section className="mb-10 sm:mb-14 animate-fade-up">
            <p className="inline-flex items-center gap-1.5 text-xs font-mono tracking-widest uppercase mb-4 px-3 py-1.5 rounded-full"
              style={{ color: 'var(--info)', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />
              Welcome back
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-tight mb-3">
              <span className="text-gradient-white">Hey,&nbsp;</span>
              <span className="text-gradient-accent">{user?.username || 'Developer'}</span>
              <span className="text-gradient-white"> 👋</span>
            </h1>
            <p className="text-base sm:text-lg" style={{ color: 'var(--fg-muted)' }}>Ready to crush some coding challenges today?</p>
          </section>

          {/* Stats strip */}
          <section className="grid grid-cols-3 gap-2 sm:gap-4 mb-10 sm:mb-14 animate-fade-up delay-1">
            {[
              { label: 'Active Rooms', value: activeRoomsCount, tokenColor: 'var(--info)' },
              { label: 'Challenges', value: myChallenges.length, tokenColor: 'var(--warning)' },
              { label: 'Pending', value: pendingChallengesCount, tokenColor: 'var(--danger)' },
            ].map(({ label, value, tokenColor }) => (
              <div key={label}
                className="rounded-2xl px-3 sm:px-5 py-4 sm:py-5 text-center transition-all duration-300 hover:-translate-y-1"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <p className="text-2xl sm:text-3xl font-bold tracking-tight mb-1" style={{ color: tokenColor }}>{value}</p>
                <p className="text-xs font-mono" style={{ color: 'var(--fg-muted)' }}>{label}</p>
              </div>
            ))}
          </section>

          {/* Action Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-12 sm:mb-16">
            {[
              { icon: Zap, title: 'Start a Challenge', desc: 'Compete with others on LeetCode', route: '/challenge', delay: 'delay-1', iconColor: 'var(--info)', bg: 'var(--accent-dim)', border: 'var(--border-accent)' },
              { icon: Users, title: 'Join a Room', desc: 'Enter an existing room with a code', route: '/join-room', delay: 'delay-2', iconColor: 'var(--cv-accent-v)', bg: 'rgba(120,80,200,0.14)', border: 'rgba(120,80,200,0.25)' },
              { icon: Plus, title: 'Create Room', desc: 'Host a new room for your friends', route: '/create-room', delay: 'delay-3', iconColor: 'var(--cv-accent-b)', bg: 'rgba(60,100,210,0.14)', border: 'rgba(60,100,210,0.25)' },
            ].map(({ icon: Icon, title, desc, route, delay, iconColor, bg, border }) => (
              <button key={title}
                className={`group text-left p-5 sm:p-6 w-full rounded-2xl transition-all duration-300 hover:-translate-y-1.5 animate-fade-up ${delay}`}
                style={{ background: 'var(--surface)', border: `1px solid var(--border)` }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-accent)'; e.currentTarget.style.boxShadow = '0 0 0 1px var(--border-accent), 0 8px 40px rgba(0,0,0,0.5), 0 0 80px var(--accent-dim)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
                onClick={() => navigate(route)}
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-4 sm:mb-5 transition-transform duration-200 group-hover:scale-110"
                  style={{ background: bg, border: `1px solid ${border}` }}>
                  <Icon size={20} style={{ color: iconColor }} />
                </div>
                <h3 className="text-sm sm:text-base font-semibold mb-1.5 tracking-tight font-mono" style={{ color: 'var(--fg)' }}>{title}</h3>
                <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--fg-muted)' }}>{desc}</p>
              </button>
            ))}
          </section>

          {/* Divider */}
          <div className="mb-10 sm:mb-14 h-px" style={{ background: 'linear-gradient(to right, transparent, var(--border-strong), transparent)' }} />

          {/* Rooms + Challenges */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 animate-fade-up delay-4">

            {/* My Rooms */}
            <div>
              <div className="flex items-center justify-between mb-4 sm:mb-5">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold tracking-tight" style={{ color: 'var(--fg)' }}>My Rooms</h2>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--fg-muted)' }}>Your active coding rooms</p>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded-full shrink-0"
                  style={{ color: 'var(--info)', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)' }}>
                  {activeRoomsCount} active
                </span>
              </div>
              <div className="flex flex-col gap-2.5 sm:gap-3">
                {displayedRooms.map((room, i) => (
                  <div key={room.roomId}  // ← room.id → room.roomId
                    className="px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)', animationDelay: `${0.08 * i}s` }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-hover)'; e.currentTarget.style.borderColor = 'var(--border-hover)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                  >
                    <div className="flex items-start justify-between mb-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                          style={{ background: 'var(--accent-dim)', color: 'var(--info)', border: '1px solid var(--border-accent)' }}>
                          {room.roomName?.[0]?.toUpperCase()}  {/* ← room.name[0] → room.roomName?.[0] */}
                        </div>
                        <h4 className="text-sm font-semibold tracking-tight truncate font-mono" style={{ color: 'var(--fg)' }}>
                          {room.roomName}  {/* ← room.name → room.roomName */}
                        </h4>
                      </div>
                      <span className="flex items-center gap-1.5 text-xs shrink-0 ml-2" style={{ color: 'var(--success)' }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse inline-block" /> live
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--fg-muted)' }}>
                      <span className="flex items-center gap-1.5">
                        <Users size={11} /> {room.members?.length} members  {/* ← room.members → room.members?.length */}
                      </span>
                      <span>{new Date(room.updatedAt).toLocaleString()}</span>  {/* ← room.lastActive → room.updatedAt */}
                    </div>
                  </div>
                ))}
              </div>
              {myRooms.length > 2 && (
                <button
                  className="w-full mt-3 py-2.5 text-sm flex items-center justify-center gap-1.5 rounded-xl transition-all duration-200"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--fg-muted)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-hover)'; e.currentTarget.style.color = 'var(--fg)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.color = 'var(--fg-muted)'; }}
                  onClick={() => setShowAllRooms(v => !v)}>
                  {showAllRooms ? <><ChevronUp size={14} /> Show Less</> : <><ChevronDown size={14} /> {myRooms.length - 2} more rooms</>}
                </button>
              )}
            </div>

            {/* My Challenges */}
            <div>
              <div className="flex items-center justify-between mb-4 sm:mb-5">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold tracking-tight" style={{ color: 'var(--fg)' }}>My Challenges</h2>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--fg-muted)' }}>LeetCode problems from friends</p>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded-full shrink-0"
                  style={{ color: 'var(--warning)', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}>
                  {pendingChallengesCount} pending
                </span>
              </div>
              <div className="flex flex-col gap-2.5 sm:gap-3">
                {displayedChallenges.map((c, i) => (
                  <div key={c._id}  // ← c.id → c._id
                    className="px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)', animationDelay: `${0.08 * i}s` }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-hover)'; e.currentTarget.style.borderColor = 'var(--border-hover)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                  >
                    <div className="flex items-start justify-between mb-2.5">
                      <h4 className="text-sm font-semibold tracking-tight pr-3 leading-snug font-mono" style={{ color: 'var(--fg)' }}>{c.title}</h4>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full shrink-0" style={diffStyle(c.difficulty)}>{c.difficulty}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs" style={{ color: 'var(--fg-muted)' }}>
                      <span className="flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-md flex items-center justify-center" style={{ background: 'var(--surface-hover)' }}><User size={9} /></span>
                        {c.sentBy}  {/* ← c.friend → c.sentBy */}
                      </span>
                      <span className="text-xs font-medium px-2.5 py-0.5 rounded-full" style={statusStyle(c.status)}>{c.status}</span>
                    </div>
                  </div>
                ))}
              </div>
              {myChallenges.length > 2 && (
                <button
                  className="w-full mt-3 py-2.5 text-sm flex items-center justify-center gap-1.5 rounded-xl transition-all duration-200"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--fg-muted)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-hover)'; e.currentTarget.style.color = 'var(--fg)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.color = 'var(--fg-muted)'; }}
                  onClick={() => setShowAllChallenges(v => !v)}>
                  {showAllChallenges ? <><ChevronUp size={14} /> Show Less</> : <><ChevronDown size={14} /> {myChallenges.length - 2} more challenges</>}
                </button>
              )}
            </div>
          </section>
          <div className="h-12 sm:h-16" />
        </main>
      </div>
    </div>
  );
}