import React, { useState, useEffect } from 'react';
import { Search, Bell, Code, Users, Zap, Plus, ChevronDown, ChevronUp, LogOut, User, ShieldCheck } from 'lucide-react';
import UserProfile from './UserProfile';
import LeetCodeVerification from './LeetVerificationCard';
import Notifications from './Notifications';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

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
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyRooms = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/room/my-rooms`, {
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
        const res = await fetch(`${API_URL}/challenge/home-challenges`, {
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

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/users/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setNotifications(data.notifications);
      } catch (err) {
        console.log('Fetch notifications error:', err);
      }
    };
    fetchNotifications();
  }, []);

  const toSlug = str => str.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');

  const displayedRooms = showAllRooms ? myRooms : myRooms.slice(0, 3);
  const displayedChallenges = showAllChallenges ? myChallenges : myChallenges.slice(0, 3);
  const activeRoomsCount = myRooms.length;
  const pendingChallengesCount = myChallenges.filter(c => c.status?.toLowerCase() !== 'solved').length;

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
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
      const res = await fetch(`${API_URL}/users/search?username=${query}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setRealUsers(data.users);
    } catch (e) { console.log('Search Error:', e); }
  };

  const fetchOtherUserProfile = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/users/profile/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) { setSelectedUser(data.user); setShowProfileCard(true); }
    } catch (e) { console.log('Error fetching user:', e); }
  };

  const handleLeetCodeVerification = async () => {
    try {
      const token = localStorage.getItem('token');
      const UserID = localStorage.getItem('userID');
      const res = await fetch(`${API_URL}/users/leetVerification`, {
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
  const handleLogout = () => { localStorage.removeItem('token'); window.location.href = '/'; };
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

  const diffStyle = (d) => ({
    Easy: { background: 'rgba(74,222,128,0.10)', color: 'var(--success)' },
    Medium: { background: 'rgba(251,191,36,0.10)', color: 'var(--warning)' },
    Hard: { background: 'rgba(248,113,113,0.10)', color: 'var(--danger)' },
  }[d] || { background: 'rgba(74,222,128,0.10)', color: 'var(--success)' });

  const statusStyle = (s) => s === 'Completed'
    ? { background: 'rgba(94,106,210,0.15)', color: 'var(--info)' }
    : { background: 'rgba(251,191,36,0.10)', color: 'var(--warning)' };

  const SearchResults = () => searchQuery && realUsers.length > 0 ? (
    <div className="absolute top-full mt-2 left-0 right-0 z-[200] rounded-xl overflow-hidden"
      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', boxShadow: '0 16px 48px rgba(0,0,0,0.7)' }}>
      {realUsers.map(u => (
        <button key={u._id}
          className="w-full text-left px-4 py-3.5 text-sm flex items-center gap-3 transition-colors duration-150 border-none outline-none cursor-pointer"
          style={{ color: 'var(--fg)', background: 'transparent' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          onClick={() => handleSuggestionClick(u._id)}
        >
          <span className="w-8 h-8 rounded-md flex items-center justify-center text-xs font-semibold shrink-0"
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
    <div className="relative min-h-screen animate-fade-in" style={{ background: 'var(--bg)', color: 'var(--fg)' }}>
      {/* Ambient */}
      <div className="blob-primary" /><div className="blob-secondary" />
      <div className="blob-tertiary" /><div className="blob-bottom" />
      <div className="noise-overlay" /><div className="grid-overlay" />

      {/* Modals at root */}
      {showProfileCard && selectedUser && <UserProfile user={user} onClose={closeProfile} ReceiverID={selectedUser} />}
      {showLeetVerificationCard && <LeetCodeVerification onClose={closeLeetVerification} verificationCode={verificationCode} userId={selectedUser} />}
      {showNotifications && <Notifications onClose={closeNotifications} />}

      <div className="relative z-10">
        {/* ═══ NAVBAR ═══ */}
        <nav
          className="sticky top-0 z-40 px-6 sm:px-8 border-b"
          style={{
            background: 'rgba(5,5,6,0.88)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderColor: 'var(--border)',
          }}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between gap-4 h-16 max-w-7xl mx-auto font-sans">
            {/* Brand */}
            <a href="#" className="flex items-center gap-3 shrink-0">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', boxShadow: '0 0 20px var(--accent-glow)' }}>
                <Code size={18} style={{ color: 'var(--info)' }} />
              </div>
              <span className="font-bold text-lg sm:text-xl tracking-tight" style={{ color: 'var(--fg)' }}>
                Code<span style={{ color: 'var(--info)' }}>Verse</span>
              </span>
            </a>

            {/* Desktop search */}
            <div className="relative flex-1 max-w-sm sm:max-w-md hidden sm:block font-sans">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--fg-muted)' }} />
              <input type="text"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl transition-all duration-200 focus:outline-none"
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
            <div className="flex items-center gap-3 font-sans">
              {/* Mobile search toggle */}
              <button className="sm:hidden w-9 h-9 flex items-center justify-center rounded-xl transition-colors border cursor-pointer"
                style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--fg)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--surface)'}
                onClick={() => setMobileSearchOpen(v => !v)}>
                <Search size={15} />
              </button>

              {/* Bell */}
              <div className="relative" onClick={e => e.stopPropagation()}>
                <button className="relative w-9 h-9 flex items-center justify-center rounded-xl transition-colors border cursor-pointer"
                  style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--fg)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--surface)'}
                  onClick={() => setShowNotifications(v => !v)}>
                  <Bell size={15} />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold text-white bg-indigo-600 animate-pulse"
                      style={{ fontSize: 9 }}>{notifications.length}</span>
                  )}
                </button>
              </div>

              {/* Profile */}
              <div className="relative flex items-center gap-3 pl-2 border-l" style={{ borderColor: 'var(--border)' }} onClick={e => e.stopPropagation()}>
                <span className="text-sm font-semibold hidden md:block text-slate-300">{user?.username || 'Developer'}</span>
                <button
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white transition-all duration-200 hover:-translate-y-px cursor-pointer border-0"
                  style={{ background: 'linear-gradient(135deg, var(--accent), var(--info))', boxShadow: '0 0 0 1px var(--border-accent), 0 4px 12px var(--accent-glow)' }}
                  onClick={() => setShowProfileDropdown(v => !v)}>
                  {user?.username?.[0]?.toUpperCase() || 'D'}
                </button>

                {showProfileDropdown && (
                  <div className="absolute top-12 right-0 min-w-[200px] py-1.5 rounded-xl z-[100] animate-slide-down overflow-hidden border"
                    style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', boxShadow: '0 16px 48px rgba(0,0,0,0.7)' }}>
                    <div className="px-4 py-2.5 border-b" style={{ borderColor: 'var(--border)' }}>
                      <p className="text-sm font-semibold" style={{ color: 'var(--fg)' }}>{user?.username || 'Developer'}</p>
                      <p className="text-xs mt-0.5 text-slate-400">Signed in</p>
                    </div>
                    {[
                      { icon: User, label: 'View Profile', action: handleViewProfile },
                      { icon: ShieldCheck, label: 'Verify LeetCode', action: handleLeetVerification },
                    ].map(({ icon: Icon, label, action }) => (
                      <button key={label}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-all duration-150 border-0 outline-none text-left cursor-pointer"
                        style={{ color: 'var(--fg-muted)', background: 'transparent' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-hover)'; e.currentTarget.style.color = 'var(--fg)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--fg-muted)'; }}
                        onClick={action}>
                        <Icon size={14} /> {label}
                      </button>
                    ))}
                    <div className="border-t mt-1 pt-1" style={{ borderColor: 'var(--border)' }}>
                      <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-all duration-150 border-0 outline-none text-left cursor-pointer"
                        style={{ color: 'var(--danger)', background: 'transparent' }}
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
            <div className="sm:hidden pb-3.5 relative">
              <Search size={14} className="absolute left-3 top-[15px] pointer-events-none" style={{ color: 'var(--fg-muted)' }} />
              <input type="text" autoFocus
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl focus:outline-none transition-all"
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
        <main className="max-w-7xl mx-auto px-6 sm:px-8 py-14 sm:py-20 font-sans">

          {/* Welcome */}
          <section className="mb-14 sm:mb-20 animate-fade-up">
            <p className="inline-flex items-center gap-2.5 text-xs sm:text-sm font-mono tracking-widest uppercase mb-5 px-4 py-2 rounded-full border"
              style={{ color: 'var(--info)', background: 'var(--accent-dim)', borderColor: 'var(--border-accent)' }}>
              <span className="w-2 h-2 rounded-full bg-current inline-block" />
              Welcome back
            </p>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-none mb-5">
              <span className="text-gradient-white">Hey,&nbsp;</span>
              <span className="text-gradient-accent">{user?.username || 'Developer'}</span>
              <span className="text-gradient-white"> 👋</span>
            </h1>
            <p className="text-xl sm:text-2xl font-semibold text-[#8A8F98]">Ready to crush some coding challenges today?</p>
          </section>

          {/* Stats strip */}
          <section className="grid grid-cols-3 gap-5 sm:gap-8 mb-14 sm:mb-20 animate-fade-up delay-1">
            {[
              { label: 'Active Rooms', value: activeRoomsCount, tokenColor: 'var(--info)' },
              { label: 'Challenges', value: myChallenges.length, tokenColor: 'var(--warning)' },
              { label: 'Pending', value: pendingChallengesCount, tokenColor: 'var(--danger)' },
            ].map(({ label, value, tokenColor }) => (
              <div key={label}
                className="rounded-3xl px-6 sm:px-10 py-6 sm:py-10 text-center transition-all duration-300 hover:-translate-y-1 border"
                style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.55)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <p className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-2.5" style={{ color: tokenColor }}>{value}</p>
                <p className="text-xs sm:text-sm font-mono tracking-widest uppercase text-slate-400 font-semibold">{label}</p>
              </div>
            ))}
          </section>

          {/* Action Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-24">
            {[
              { icon: Zap, title: 'Start a Challenge', desc: 'Compete with others on LeetCode systems', route: '/challenge', delay: 'delay-1', iconColor: 'var(--info)', bg: 'var(--accent-dim)', border: 'var(--border-accent)' },
              { icon: Users, title: 'Join a Room', desc: 'Enter an existing room with a password', route: '/join-room', delay: 'delay-2', iconColor: 'rgba(139, 92, 246, 0.8)', bg: 'rgba(139, 92, 246, 0.12)', border: 'rgba(139, 92, 246, 0.25)' },
              { icon: Plus, title: 'Create Room', desc: 'Host a new collaborative editor room', route: '/create-room', delay: 'delay-3', iconColor: 'rgba(56, 189, 248, 0.8)', bg: 'rgba(56, 189, 248, 0.12)', border: 'rgba(56, 189, 248, 0.25)' },
            ].map(({ icon: Icon, title, desc, route, delay, iconColor, bg, border }) => (
              <button key={title}
                className={`group text-left p-8 sm:p-10 w-full rounded-3xl transition-all duration-300 hover:-translate-y-1.5 animate-fade-up border cursor-pointer ${delay}`}
                style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-accent)'; e.currentTarget.style.boxShadow = '0 0 0 1px var(--border-accent), 0 16px 64px rgba(0,0,0,0.65), 0 0 100px var(--accent-dim)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
                onClick={() => navigate(route)}
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-200 group-hover:scale-110 border"
                  style={{ background: bg, borderColor: border }}>
                  <Icon size={24} style={{ color: iconColor }} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-3 tracking-tight font-mono text-white">{title}</h3>
                <p className="text-sm sm:text-base leading-relaxed text-slate-400">{desc}</p>
              </button>
            ))}
          </section>

          {/* Divider */}
          <div className="mb-16 sm:mb-24 h-px" style={{ background: 'linear-gradient(to right, transparent, var(--border-strong), transparent)' }} />

          {/* Rooms + Challenges */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 animate-fade-up delay-4">

            {/* My Rooms */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono">My Rooms</h2>
                  <p className="text-xs sm:text-sm mt-1.5 text-slate-400">Your active collaborative coding rooms</p>
                </div>
                <span className="text-xs sm:text-sm font-mono px-4 py-2 rounded-full shrink-0 border"
                  style={{ color: 'var(--info)', background: 'var(--accent-dim)', borderColor: 'var(--border-accent)' }}>
                  {activeRoomsCount} active
                </span>
              </div>
              <div className="flex flex-col gap-4 sm:gap-5">
                {displayedRooms.map((room, i) => (
                  <div key={room.roomId}
                    className="px-6 sm:px-8 py-5.5 sm:py-6 rounded-3xl cursor-pointer transition-all duration-200 hover:-translate-y-0.5 border"
                    style={{ background: 'var(--surface)', borderColor: 'var(--border)', animationDelay: `${0.08 * i}s` }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-hover)'; e.currentTarget.style.borderColor = 'var(--border-hover)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                    onClick={() => navigate(`/room/${room.roomId}`)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-sm sm:text-base font-bold shrink-0 border"
                          style={{ background: 'var(--accent-dim)', color: 'var(--info)', borderColor: 'var(--border-accent)' }}>
                          {room.roomName?.[0]?.toUpperCase()}
                        </div>
                        <h4 className="text-base sm:text-lg font-bold tracking-tight truncate font-mono text-white">
                          {room.roomName}
                        </h4>
                      </div>
                      <span className="flex items-center gap-2 text-xs sm:text-sm shrink-0 ml-2 font-semibold" style={{ color: 'var(--success)' }}>
                        <span className="w-2.5 h-2.5 rounded-full bg-current animate-pulse inline-block" /> live
                      </span>
                    </div>
                    <div className="flex items-center gap-5 text-xs sm:text-sm font-semibold text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Users size={14} /> {room.members?.length} members
                      </span>
                      <span>Updated {new Date(room.updatedAt).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
              {myRooms.length > 3 && (
                <button
                  className="w-full mt-5 py-3.5 text-xs sm:text-sm font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 rounded-2xl transition-all duration-200 border cursor-pointer"
                  style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--fg-muted)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-hover)'; e.currentTarget.style.color = 'var(--fg)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.color = 'var(--fg-muted)'; }}
                  onClick={() => setShowAllRooms(v => !v)}>
                  {showAllRooms ? <><ChevronUp size={15} /> Show Less</> : <><ChevronDown size={15} /> {myRooms.length - 3} more rooms</>}
                </button>
              )}
            </div>

            {/* My Challenges */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono">My Challenges</h2>
                  <p className="text-xs sm:text-sm mt-1.5 text-slate-400">LeetCode problems sent by friends</p>
                </div>
                <span className="text-xs sm:text-sm font-mono px-4 py-2 rounded-full shrink-0 border"
                  style={{ color: 'var(--warning)', background: 'rgba(251,191,36,0.08)', borderColor: 'rgba(251,191,36,0.2)' }}>
                  {pendingChallengesCount} pending
                </span>
              </div>
              <div className="flex flex-col gap-4 sm:gap-5">
                {displayedChallenges.map((c, i) => (
                  <div key={c._id}
                    className="px-6 sm:px-8 py-5.5 sm:py-6 rounded-3xl cursor-pointer transition-all duration-200 hover:-translate-y-0.5 border"
                    style={{ background: 'var(--surface)', borderColor: 'var(--border)', animationDelay: `${0.08 * i}s` }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-hover)'; e.currentTarget.style.borderColor = 'var(--border-hover)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                    onClick={() => window.open(`https://leetcode.com/problems/${toSlug(c.title)}`, '_blank', 'noopener,noreferrer')}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-base sm:text-lg font-bold tracking-tight pr-3 leading-snug font-mono text-white">{c.title}</h4>
                      <span className="text-xs sm:text-sm font-semibold px-3 py-1 rounded-full shrink-0" style={diffStyle(c.difficulty)}>{c.difficulty}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-400">
                      <span className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md flex items-center justify-center bg-white/5 border border-white/5"><User size={12} /></span>
                        {c.sentBy}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold px-3 py-1 rounded-full" style={statusStyle(c.status)}>{c.status}</span>
                    </div>
                  </div>
                ))}
              </div>
              {myChallenges.length > 3 && (
                <button
                  className="w-full mt-5 py-3.5 text-xs sm:text-sm font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 rounded-2xl transition-all duration-200 border cursor-pointer"
                  style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--fg-muted)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-hover)'; e.currentTarget.style.color = 'var(--fg)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.color = 'var(--fg-muted)'; }}
                  onClick={() => setShowAllChallenges(v => !v)}>
                  {showAllChallenges ? <><ChevronUp size={15} /> Show Less</> : <><ChevronDown size={15} /> {myChallenges.length - 3} more challenges</>}
                </button>
              )}
            </div>
          </section>
          <div className="h-20" />
        </main>
      </div>
    </div>
  );
}