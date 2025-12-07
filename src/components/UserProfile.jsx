import React, { useState, useEffect } from 'react';
import { X, Users, Award, CheckCircle, Code, UserPlus, UserCheck } from 'lucide-react';

export default function UserProfile({ userId, onClose, ReceiverID }) {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFriend, setIsFriend] = useState(false);
  const [friendRequestSent, setFriendRequestSent] = useState(false);
  const [formateddate, setFormateddate] = useState(null);

  useEffect(() => {

    setTimeout(() => {
      setUserProfile({
        username: "Alex_234",
        leetcodeUsername: 'alex_leetcode',
        problemsSolved: 487,
        challengesCompleted: 23,
        friendsCount: 156,
        profilePic: null,
        bio: 'Passionate about algorithms and competitive programming',
        rank: 'Guardian',
        joinedDate: 'January 2023'
      });
      setLoading(false);
    }, 500);
  }, [userId]);


  useEffect(() => {
  if (ReceiverID && ReceiverID.createdAt) {
    const createdAt = new Date(ReceiverID.createdAt);
    const options = { year: "numeric", month: "long" };
    const formattedDate = createdAt.toLocaleDateString("en-US", options);

    setFormateddate(formattedDate);
  }
}, [ReceiverID]);


  const handleAddFriend = async () => {
    try {
      const token = localStorage.getItem(token);
      const UserID = localStorage.getItem(UserID);
      const res = await fetch("http//:localhost:5000", {
        method: POST,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(
          {
            senderId: userId,
            receiverId: ReceiverID,
          }
        ),
      });

      const data = res.json();
      console.log("Freind Request :", data);

      setFriendRequestSent(true);
      setTimeout(() => {
        alert('Friend request sent!');
      }, 100);
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  const closeProfile = () => {
    setShowProfileCard(false);
    setSelectedUser(null);
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  const overlayStyles = `
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.75);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      padding: 1rem;
      backdrop-filter: blur(4px);
    }
  `;

  const styles = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .profile-card {
      background-color: #0f0f0f;
      border: 1px solid #2a2a2a;
      border-radius: 16px;
      max-width: 700px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
      position: relative;
    }
    .profile-card::-webkit-scrollbar {
      width: 8px;
    }
    .profile-card::-webkit-scrollbar-track {
      background: #1a1a1a;
      border-radius: 4px;
    }
    .profile-card::-webkit-scrollbar-thumb {
      background: #3a3a3a;
      border-radius: 4px;
    }
    .profile-card::-webkit-scrollbar-thumb:hover {
      background: #4a4a4a;
    }
    .close-btn {
      position: absolute;
      top: 1rem;
      right: 1rem;
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
      z-index: 10;
    }
    .close-btn:hover {
      background-color: #252525;
      border-color: #3a3a3a;
    }
    .profile-header {
      background: linear-gradient(135deg, #1a1a1a, #252525);
      border-bottom: 1px solid #2a2a2a;
      padding: 2.5rem 2rem 2rem;
      text-align: center;
      position: relative;
    }
    .profile-avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: linear-gradient(135deg, #00d9ff, #0a7ea4);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      font-weight: 700;
      color: #000;
      margin: 0 auto 1rem;
      border: 3px solid #2a2a2a;
    }
    .profile-username {
      font-size: 2rem;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 0.5rem;
    }
    .profile-bio {
      color: #a0a0a0;
      font-size: 0.95rem;
      margin-bottom: 1rem;
    }
    .profile-meta {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1.5rem;
      color: #a0a0a0;
      font-size: 0.9rem;
      margin-bottom: 1.5rem;
    }
    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .add-friend-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: linear-gradient(135deg, #00d9ff, #0a7ea4);
      border: none;
      color: #000;
      padding: 0.75rem 2rem;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.95rem;
      font-weight: 600;
      transition: all 0.3s;
    }
    .add-friend-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 217, 255, 0.3);
    }
    .add-friend-btn:disabled {
      background: #2a2a2a;
      color: #808080;
      cursor: not-allowed;
      transform: none;
    }
    .friend-status-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background-color: #1a4d2e;
      border: 1px solid #2a5f3a;
      color: #4ade80;
      padding: 0.75rem 2rem;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: default;
    }
    .profile-content {
      padding: 2rem;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    .stat-card {
      background: linear-gradient(135deg, #1a1a1a, #252525);
      border: 1px solid #2a2a2a;
      border-radius: 12px;
      padding: 1.5rem;
      transition: all 0.3s;
    }
    .stat-card:hover {
      border-color: #3a3a3a;
      transform: translateY(-2px);
    }
    .stat-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }
    .stat-icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .stat-icon-blue {
      background: linear-gradient(135deg, #1e3a5f, #0a4d6e);
      color: #00d9ff;
    }
    .stat-icon-green {
      background: linear-gradient(135deg, #1a4d2e, #0d3d1f);
      color: #4ade80;
    }
    .stat-icon-purple {
      background: linear-gradient(135deg, #3a1e5f, #2a1447);
      color: #a78bfa;
    }
    .stat-icon-orange {
      background: linear-gradient(135deg, #4d3a1a, #3d2a0a);
      color: #fbbf24;
    }
    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 0.25rem;
    }
    .stat-label {
      color: #a0a0a0;
      font-size: 0.85rem;
      font-weight: 500;
    }
    .info-section {
      background: linear-gradient(135deg, #1a1a1a, #252525);
      border: 1px solid #2a2a2a;
      border-radius: 12px;
      padding: 1.5rem;
    }
    .section-title {
      font-size: 1.2rem;
      font-weight: 600;
      color: #ffffff;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem 0;
      border-bottom: 1px solid #2a2a2a;
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .info-label {
      color: #a0a0a0;
      font-weight: 500;
      font-size: 0.9rem;
    }
    .info-value {
      color: #ffffff;
      font-weight: 600;
      font-size: 0.9rem;
    }
    .leetcode-link {
      color: #00d9ff;
      text-decoration: none;
      transition: color 0.3s;
    }
    .leetcode-link:hover {
      color: #00b8d9;
      text-decoration: underline;
    }
    @media (max-width: 768px) {
      .profile-header {
        padding: 2rem 1.5rem 1.5rem;
      }
      .profile-username {
        font-size: 1.5rem;
      }
      .stats-grid {
        grid-template-columns: 1fr;
      }
      .profile-meta {
        flex-direction: column;
        gap: 0.5rem;
      }
    }
  `;

  if (loading) {
    return (
      <div className="modal-overlay">
        <style>{overlayStyles + styles}</style>
        <div className="profile-card">
          <div style={{ textAlign: 'center', padding: '3rem', color: '#e0e0e0',width: '100vw' }}>
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <style>{overlayStyles + styles}</style>

      <div className="profile-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={handleClose}>
          <X size={20} />
        </button>

        
        <div className="profile-header">
          <div className="profile-avatar">
            {ReceiverID.username[0].toUpperCase()}
          </div>
          <h1 className="profile-username">{ReceiverID.username}</h1>
          <p className="profile-bio">{ReceiverID.bio}</p>
          <div className="profile-meta">
            <span className="meta-item">
              <span>🏆</span> {userProfile.rank}
            </span>
            <span className="meta-item">
              <span>📅</span> Joined {formateddate}
            </span>
          </div>

          {/* Add Friend Button */}
          {isFriend ? (
            <button className="friend-status-btn">
              <UserCheck size={18} />
              Friends
            </button>
          ) : friendRequestSent ? (
            <button className="add-friend-btn" disabled>
              <UserCheck size={18} />
              Request Sent
            </button>
          ) : (
            <button className="add-friend-btn" onClick={handleAddFriend}>
              <UserPlus size={18} />
              Add Friend
            </button>
          )}
        </div>

        {/* Profile Content */}
        <div className="profile-content">
          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon stat-icon-blue">
                  <Code size={22} />
                </div>
                <div className="stat-label">Problems Solved</div>
              </div>
              <div className="stat-value">{ReceiverID.totalProblemsSolved}</div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon stat-icon-green">
                  <CheckCircle size={22} />
                </div>
                <div className="stat-label">Challenges</div>
              </div>
              <div className="stat-value">{ReceiverID.challengesReceived.length}</div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon stat-icon-purple">
                  <Users size={22} />
                </div>
                <div className="stat-label">Friends</div>
              </div>
              <div className="stat-value">{ReceiverID.friends.length}</div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon stat-icon-orange">
                  <Award size={22} />
                </div>
                <div className="stat-label">Success Rate</div>
              </div>
              <div className="stat-value">
                {Math.round((userProfile.challengesCompleted / userProfile.problemsSolved) * 100)}%
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="info-section">
            <h2 className="section-title">
              <Code size={20} />
              Coding Profile
            </h2>
            <div className="info-row">
              <span className="info-label">LeetCode Username</span>
              <a
                href={`https://leetcode.com/${ReceiverID.leetcodeUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="leetcode-link"
              >
                @{ReceiverID.leetcodeUsername}
              </a>
            </div>
            <div className="info-row">
              <span className="info-label">Total Problems</span>
              <span className="info-value">{ReceiverID.totalProblemsSolved}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Challenges Won</span>
              <span className="info-value">{ReceiverID.challengesReceived.length}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Network</span>
              <span className="info-value">{ReceiverID.friends.length} Friends</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}