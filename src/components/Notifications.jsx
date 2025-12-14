import React, { useState, useEffect } from 'react';
import { X, UserPlus, Trophy, Users, Check, XCircle } from 'lucide-react';

export default function Notifications({ onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const userID = localStorage.getItem("userID");
      const response = await fetch("http://localhost:5000/users/notifications", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log(userID);
      console.log(data);
      if (data.success) {
        console.log("ye", data.notifications);
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.log("Notifications Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFriendRequest = async (notificationId, senderId, action) => {
    try {
      const token = localStorage.getItem("token");
      console.log("Intiated");
      const response = await fetch("http://localhost:5000/friends/respond", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          notificationId,
          senderId,
          action,
        }),
      });

      const data = await response.json();
      console.log(data);
      if (data.success) {
        alert("Accepted");
        setNotifications(notifications.filter(n => n.id !== notificationId));
      }
    } catch (error) {
      console.log("Friend request error:", error);
    }
  };

  const handleChallengeResponse = async (notificationId, challengeId, action) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/challenges/respond", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          notificationId,
          challengeId,
          action, // 'accept' or 'reject'
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Remove notification from list
        setNotifications(notifications.filter(n => n.id !== notificationId));
      }
    } catch (error) {
      console.log("Challenge response error:", error);
    }
  };

  const dismissNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/notifications/${notificationId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications(notifications.filter(n => n.id !== notificationId));
    } catch (error) {
      console.log("Dismiss notification error:", error);
    }
  };

  // Sample notifications for demonstration
  const sampleNotifications = [
    {
      id: 1,
      type: 'friend_request',
      sender: { id: 'user123', username: 'alex_coder', avatar: 'A' },
      message: 'sent you a friend request',
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      type: 'challenge',
      sender: { id: 'user456', username: 'sarah_dev', avatar: 'S' },
      challenge: { id: 'ch789', title: 'Two Sum', difficulty: 'Easy' },
      message: 'challenged you to solve',
      timestamp: '5 hours ago'
    },
    {
      id: 3,
      type: 'room_added',
      room: { id: 'room101', name: 'Algorithm Masters' },
      addedBy: { username: 'mike_admin' },
      message: 'added you to',
      timestamp: '1 day ago'
    },
    {
      id: 4,
      type: 'friend_request',
      sender: { id: 'user789', username: 'emma_codes', avatar: 'E' },
      message: 'sent you a friend request',
      timestamp: '3 hours ago'
    },
    {
      id: 5,
      type: 'challenge',
      sender: { id: 'user999', username: 'john_dev', avatar: 'J' },
      challenge: { id: 'ch999', title: 'Binary Tree Traversal', difficulty: 'Medium' },
      message: 'challenged you to solve',
      timestamp: '6 hours ago'
    }
  ];

  const displayNotifications = loading ? [] : (notifications.length > 0 ? notifications : sampleNotifications);

  const styles = `
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.75);
      display: flex;
      align-items: flex-start;
      justify-content: center;
      z-index: 9999;
      padding: 1rem;
      backdrop-filter: blur(4px);
      overflow-y: auto;
    }
    .notifications-card {
      background-color: #0f0f0f;
      border: 1px solid #2a2a2a;
      border-radius: 16px;
      max-width: 600px;
      width: 100%;
      margin-top: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
      position: relative;
    }
    .card-header {
      background: linear-gradient(135deg, #1a1a1a, #252525);
      border-bottom: 1px solid #2a2a2a;
      padding: 1.5rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 16px 16px 0 0;
    }
    .header-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .close-btn {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background-color: #1a1a1a;
      border: 1px solid #2a2a2a;
      color: #e0e0e0;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
    }
    .close-btn:hover {
      background-color: #252525;
      border-color: #3a3a3a;
    }
    .notifications-list {
      max-height: 70vh;
      overflow-y: auto;
      padding: 0;
    }
    .notifications-list::-webkit-scrollbar {
      width: 8px;
    }
    .notifications-list::-webkit-scrollbar-track {
      background: #1a1a1a;
    }
    .notifications-list::-webkit-scrollbar-thumb {
      background: #3a3a3a;
      border-radius: 4px;
    }
    .notification-item {
      padding: 1.5rem 2rem;
      border-bottom: 1px solid #2a2a2a;
      transition: background-color 0.3s;
    }
    .notification-item:hover {
      background-color: #1a1a1a;
    }
    .notification-item:last-child {
      border-bottom: none;
    }
    .notification-header {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    .notification-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.2rem;
      flex-shrink: 0;
    }
    .avatar-friend {
      background: linear-gradient(135deg, #00d9ff, #0a7ea4);
      color: #000;
    }
    .avatar-challenge {
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
      color: #000;
    }
    .avatar-room {
      background: linear-gradient(135deg, #a78bfa, #7c3aed);
      color: #000;
    }
    .notification-content {
      flex: 1;
    }
    .notification-text {
      color: #e0e0e0;
      font-size: 0.95rem;
      line-height: 1.5;
      margin-bottom: 0.25rem;
    }
    .username-highlight {
      color: #00d9ff;
      font-weight: 600;
    }
    .challenge-title {
      color: #fbbf24;
      font-weight: 600;
    }
    .room-name {
      color: #a78bfa;
      font-weight: 600;
    }
    .notification-timestamp {
      color: #808080;
      font-size: 0.85rem;
    }
    .difficulty-badge {
      display: inline-block;
      padding: 0.25rem 0.6rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      margin-left: 0.5rem;
    }
    .badge-easy {
      background-color: #1a4d2e;
      color: #4ade80;
    }
    .badge-medium {
      background-color: #4d3a1a;
      color: #fbbf24;
    }
    .badge-hard {
      background-color: #4d1a1a;
      color: #f87171;
    }
    .action-buttons {
      display: flex;
      gap: 0.75rem;
      margin-top: 1rem;
    }
    .btn-accept {
      flex: 1;
      padding: 0.65rem 1rem;
      background: linear-gradient(135deg, #4ade80, #22c55e);
      border: none;
      border-radius: 8px;
      color: #000;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: all 0.3s;
    }
    .btn-accept:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(74, 222, 128, 0.3);
    }
    .btn-reject {
      flex: 1;
      padding: 0.65rem 1rem;
      background-color: #1a1a1a;
      border: 1px solid #2a2a2a;
      border-radius: 8px;
      color: #e0e0e0;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: all 0.3s;
    }
    .btn-reject:hover {
      background-color: #252525;
      border-color: #3a3a3a;
      transform: translateY(-2px);
    }
    .btn-dismiss {
      width: 100%;
      padding: 0.65rem 1rem;
      background-color: #1a1a1a;
      border: 1px solid #2a2a2a;
      border-radius: 8px;
      color: #808080;
      font-weight: 500;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.3s;
      margin-top: 1rem;
    }
    .btn-dismiss:hover {
      background-color: #252525;
      border-color: #3a3a3a;
      color: #a0a0a0;
    }
    .empty-state {
      text-align: center;
      padding: 3rem 2rem;
      color: #808080;
    }
    .empty-state-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    @media (max-width: 768px) {
      .notifications-card {
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
      }
      .card-header {
        padding: 1rem 1.5rem;
      }
      .notification-item {
        padding: 1rem 1.5rem;
      }
      .header-title {
        font-size: 1.25rem;
      }
    }
  `;

  const renderNotification = (notifications) => {
    switch (notifications.type) {
      case 'friend-request':
        return (
          <div key={notifications._id} className="notification-item">
            <div className="notification-header">
              <div className="notification-avatar avatar-friend">
                {notifications?.message?.[0].toUpperCase()}
              </div>
              <div className="notification-content">
                <div className="notification-text">
                  <span className="username-highlight">{notifications.message?.split(" ")[0]}</span> {notifications.message}
                </div>
                <div className="notification-timestamp">{notifications.createdAt}</div>
                <div className="action-buttons">
                  <button
                    className="btn-accept"
                    onClick={() => handleFriendRequest(notifications._id, notifications.senderId, 'accept')}
                  >
                    <Check size={16} />
                    Accept
                  </button>
                  <button
                    className="btn-reject"
                    onClick={() => handleFriendRequest(notifications._id, notifications.senderId, 'reject')}
                  >
                    <XCircle size={16} />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'challenge':
        return (
          <div key={notifications._id} className="notification-item">
            <div className="notification-header">
              <div className="notification-avatar avatar-challenge">
                {notifications?.message?.[0].toUpperCase()}
              </div>
              <div className="notification-content">
                <div className="notification-text">
                  <span className="username-highlight">{notifications.message?.split(" ")[0]}</span> {notifications.message}{' '}
                  <span className="challenge-title">{notifications?.challenge?.title || "Tw Sum"}</span>
                  <span className={`difficulty-badge badge-${notifications?.challenge?.difficulty.toLowerCase() || "Easy"}`}>
                    {notifications.challenge.difficulty}
                  </span>
                </div>
                <div className="notification-timestamp">{notifications.createdAt}</div>
                <div className="action-buttons">
                  <button
                    className="btn-accept"
                    onClick={() => handleChallengeResponse(notifications._id, notifications.challenge.id, 'accept')}
                  >
                    <Trophy size={16} />
                    Accept Challenge
                  </button>
                  <button
                    className="btn-reject"
                    onClick={() => handleChallengeResponse(notifications._id, notifications.challenge.id, 'reject')}
                  >
                    <XCircle size={16} />
                    Decline
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

        case 'friend-accepted':
        return (
          <div key={notifications._id} className="notification-item">
            <div className="notification-header">
              <div className="notification-avatar avatar-friend">
                {notifications?.message?.[0].toUpperCase()}
              </div>
              <div className="notification-content">
                <div className="notification-text">
                  <span className="username-highlight">{notifications.message?.split(" ")[0]}</span> {notifications.message}
                </div>
                <div className="notification-timestamp">{notifications.createdAt}</div>
                <button 
                  className="btn-dismiss"
                  onClick={() => dismissNotification(notifications._id)}
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        );

      case 'room_added':
        return (
          <div key={notifications._id} className="notification-item">
            <div className="notification-header">
              <div className="notification-avatar avatar-room">
                <Users size={24} />
              </div>
              <div className="notification-content">
                <div className="notification-text">
                  <span className="username-highlight">{notifications.addedBy.username}</span> {notifications.message}{' '}
                  <span className="room-name">{notifications.room?.name || "XYZ"}</span>
                </div>
                <div className="notification-timestamp">{notifications.createdAt}</div>
                <button
                  className="btn-dismiss"
                  onClick={() => dismissNotification(notifications._id)}
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <style>{styles}</style>

      <div className="notifications-card" onClick={(e) => e.stopPropagation()}>
        <div className="card-header">
          <h2 className="header-title">
            🔔 Notifications
          </h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="notifications-list">
          {loading ? (
            <div className="empty-state">
              <div className="empty-state-icon">⏳</div>
              <div>Loading notifications...</div>
            </div>
          ) : displayNotifications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔕</div>
              <div>No notifications yet</div>
            </div>
          ) : (
            displayNotifications.map((notifications) => (
              <React.Fragment key={notifications._id}>
                {renderNotification(notifications)}
              </React.Fragment>
            ))
          )}
        </div>

      </div>
    </div>
  );
}