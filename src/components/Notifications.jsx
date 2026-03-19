import React, { useState, useEffect } from 'react';
import { X, Check, XCircle, Trophy, Users, Bell } from 'lucide-react';

export default function Notifications({ onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchNotifications(); }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res   = await fetch('http://localhost:5000/users/notifications', { headers: { Authorization: `Bearer ${token}` } });
      const data  = await res.json();
      if (data.success) setNotifications(data.notifications);
    } catch (e) { console.log('Notifications Error:', e); }
    finally { setLoading(false); }
  };

  const handleFriendRequest = async (notificationId, senderId, action) => {
    try {
      const token = localStorage.getItem('token');
      const res   = await fetch('http://localhost:5000/friends/respond', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ notificationId, senderId, action }),
      });
      const data = await res.json();
      if (data.success) { alert('Accepted'); setNotifications(n => n.filter(x => x._id !== notificationId)); }
    } catch (e) { console.log('Friend request error:', e); }
  };

  const handleChallengeResponse = async (notificationId, challengeId, action) => {
    try {
      const token = localStorage.getItem('token');
      const res   = await fetch('http://localhost:5000/challenge/respond', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ notificationId, challengeId, action }),
      });
      const data = await res.json();
      if (data.success) { setNotifications(n => n.filter(x => x._id !== notificationId)); alert(data.message); }
    } catch (e) { console.log('Challenge response error:', e); }
  };

  const dismissNotification = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/notifications/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      setNotifications(n => n.filter(x => x._id !== id));
    } catch (e) { console.log('Dismiss error:', e); }
  };

  const sample = [
    { _id: 1, type: 'friend-request',  message: 'alex_coder sent you a friend request', senderId: 'u1', createdAt: '2 hours ago' },
    { _id: 2, type: 'challenge',        message: 'sarah_dev challenged you to solve',    challengeId: { _id: 'c1', title: 'Two Sum', difficulty: 'Easy' }, createdAt: '5 hours ago' },
    { _id: 3, type: 'room_added',       addedBy: { username: 'mike_admin' }, message: 'added you to', room: { name: 'Algorithm Masters' }, createdAt: '1 day ago' },
  ];
  const display = loading ? [] : (notifications.length > 0 ? notifications : sample);

  const avatarGrad = {
    'friend-request':  'linear-gradient(135deg, var(--accent), var(--info))',
    challenge:         'linear-gradient(135deg, var(--warning), #f97316)',
    'friend-accepted': 'linear-gradient(135deg, var(--success), #14b8a6)',
    room_added:        'linear-gradient(135deg, #8b5cf6, #7c3aed)',
  };

  const diffStyle = (d = 'Easy') => ({
    Easy:   { background: 'rgba(74,222,128,0.10)',  color: 'var(--success)' },
    Medium: { background: 'rgba(251,191,36,0.10)',  color: 'var(--warning)' },
    Hard:   { background: 'rgba(248,113,113,0.10)', color: 'var(--danger)' },
  }[d] || { background: 'rgba(74,222,128,0.10)', color: 'var(--success)' });

  const renderNotification = (n) => (
    <div key={n._id} className="px-5 py-4 transition-colors duration-150"
      style={{ borderBottom: '1px solid var(--border)' }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
          style={{ background: avatarGrad[n.type] || avatarGrad['friend-request'] }}>
          {n.type === 'room_added' ? <Users size={16} /> : (n.message?.[0]?.toUpperCase() || 'N')}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm leading-relaxed mb-1" style={{ color: 'var(--fg)' }}>
            {n.type === 'friend-request' && (<><span className="font-semibold" style={{ color: 'var(--info)' }}>{n.message?.split(' ')[0]}</span>{' '}{n.message?.split(' ').slice(1).join(' ')}</>)}
            {n.type === 'challenge'      && (<>{n.message}{' '}<span className="font-semibold" style={{ color: 'var(--warning)' }}>{n.challengeId?.title}</span>{' '}<span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={diffStyle(n.challengeId?.difficulty)}>{n.challengeId?.difficulty}</span></>)}
            {n.type === 'friend-accepted'&& n.message}
            {n.type === 'room_added'     && (<><span className="font-semibold" style={{ color: 'var(--info)' }}>{n.addedBy?.username}</span>{' '}{n.message}{' '}<span className="font-semibold" style={{ color: '#a78bfa' }}>{n.room?.name}</span></>)}
          </p>
          <p className="text-xs mb-3 font-mono" style={{ color: 'var(--fg-muted)' }}>
            {typeof n.createdAt === 'string' && n.createdAt.includes('T') ? new Date(n.createdAt).toLocaleString() : n.createdAt}
          </p>

          {/* Actions */}
          {n.type === 'friend-request' && (
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-colors"
                style={{ background: 'rgba(74,222,128,0.10)', color: 'var(--success)', border: '1px solid rgba(74,222,128,0.25)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(74,222,128,0.18)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(74,222,128,0.10)'}
                onClick={() => handleFriendRequest(n._id, n.senderId, 'accept')}><Check size={13} /> Accept</button>
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-colors"
                style={{ background: 'var(--surface)', color: 'var(--fg-muted)', border: '1px solid var(--border)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--surface)'}
                onClick={() => handleFriendRequest(n._id, n.senderId, 'reject')}><XCircle size={13} /> Decline</button>
            </div>
          )}
          {n.type === 'challenge' && (
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-colors"
                style={{ background: 'var(--accent-dim)', color: 'var(--info)', border: '1px solid var(--border-accent)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(94,106,210,0.22)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--accent-dim)'}
                onClick={() => handleChallengeResponse(n._id, n.challengeId?._id, 'accept')}><Trophy size={13} /> Accept</button>
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-colors"
                style={{ background: 'var(--surface)', color: 'var(--fg-muted)', border: '1px solid var(--border)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--surface)'}
                onClick={() => handleChallengeResponse(n._id, n.challengeId?._id, 'reject')}><XCircle size={13} /> Decline</button>
            </div>
          )}
          {(n.type === 'friend-accepted' || n.type === 'room_added') && (
            <button className="w-full py-2 rounded-lg text-xs font-medium transition-colors"
              style={{ background: 'var(--surface)', color: 'var(--fg-muted)', border: '1px solid var(--border)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--surface)'}
              onClick={() => dismissNotification(n._id)}>Dismiss</button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
      style={{ background: 'rgba(0,0,0,0.70)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl overflow-hidden animate-fade-up flex flex-col max-h-[80vh]"
        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 24px 64px rgba(0,0,0,0.8)' }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--accent-dim)', border: '1px solid var(--border-accent)' }}>
              <Bell size={15} style={{ color: 'var(--info)' }} />
            </div>
            <h2 className="text-base font-semibold" style={{ color: 'var(--fg)' }}>Notifications</h2>
            {display.length > 0 && (
              <span className="text-xs font-mono px-2 py-0.5 rounded-full"
                style={{ background: 'var(--accent-dim)', color: 'var(--info)', border: '1px solid var(--border-accent)' }}>
                {display.length}
              </span>
            )}
          </div>
          <button className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--fg-muted)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-hover)'; e.currentTarget.style.color = 'var(--fg)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)';       e.currentTarget.style.color = 'var(--fg-muted)'; }}
            onClick={onClose}><X size={15} /></button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: 'var(--accent-dim)', borderTopColor: 'var(--accent)' }} />
              <p className="text-xs font-mono tracking-widest uppercase" style={{ color: 'var(--fg-muted)' }}>Loading</p>
            </div>
          ) : display.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <Bell size={20} style={{ color: 'var(--fg-muted)' }} />
              </div>
              <p className="text-sm" style={{ color: 'var(--fg-muted)' }}>No notifications yet</p>
            </div>
          ) : display.map(n => <React.Fragment key={n._id}>{renderNotification(n)}</React.Fragment>)}
        </div>
      </div>
    </div>
  );
}