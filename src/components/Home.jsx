import React, { useState, useEffect } from 'react';
import { Search, Bell, Code } from 'lucide-react';
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
  // const [showNotifications,setShowNotifications] = useState(false);
  const navigate = useNavigate()
  // Sample data
  const myRooms = [
    { id: 1, name: 'Tech Wizards', members: 8, lastActive: '2 hours ago' },
    { id: 2, name: 'Code Masters', members: 5, lastActive: '1 day ago' },
    { id: 3, name: 'Gaming Squad', members: 12, lastActive: '3 hours ago' },
    { id: 4, name: 'Algorithm Masters', members: 15, lastActive: '5 hours ago' },
    { id: 5, name: 'Web Dev Warriors', members: 9, lastActive: '1 day ago' }
  ];

  const myChallenges = [
    { id: 1, title: 'Two Sum', friend: 'Alex', difficulty: 'Easy', status: 'Pending' },
    { id: 2, title: 'Longest Substring Without Repeating', friend: 'Sarah', difficulty: 'Medium', status: 'Completed' },
    { id: 3, title: 'Binary Tree Level Order Traversal', friend: 'Mike', difficulty: 'Medium', status: 'Pending' },
    { id: 4, title: 'Merge K Sorted Lists', friend: 'Emma', difficulty: 'Hard', status: 'Pending' },
    { id: 5, title: 'Valid Parentheses', friend: 'John', difficulty: 'Easy', status: 'Completed' }
  ];



  const displayedRooms = showAllRooms ? myRooms : myRooms.slice(0, 2);
  const displayedChallenges = showAllChallenges ? myChallenges : myChallenges.slice(0, 2);

  const activeRoomsCount = myRooms.length;
  const pendingChallengesCount = myChallenges.filter(c => c.status === 'Pending').length;


  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/auth/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setUser(data.user);
      } else {
        alert("Session expired. Please login again.");
      }
    } catch (error) {
      console.log("Profile Error:", error);
      alert("Something went wrong.");
    }
    setLoading(false);
  };


  const searchUsers = async (query) => {
    try {
      if (!query.trim()) {
        setRealUsers([]);
        return;
      }

      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/users/search?username=${query}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );

      const data = await response.json();
      console.log(data);
      if (data.success) {
        setRealUsers(data.users);
      }
    } catch (error) {
      console.log("Search Error:", error);
    }
  };

  const fetchOtherUserProfile = async (userId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/users/profile/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      console.log(data);

      if (data.success) {
        setSelectedUser(data.user);
        setShowProfileCard(true);
      }

    } catch (error) {
      console.log("Error fetching user:", error);
    }
  };


  const handleLeetCodeVerification = async () => {
    try {
      const token = localStorage.getItem("token");
      const UserID = localStorage.getItem("userID");

      const res = await fetch("http://localhost:5000/users/leetVerification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: UserID }),
      });

      const data = await res.json();
      console.log(data);

      if (data.success) {
        setVerificationCode(data.code);
      } else {
        alert(data.message);
        if (data?.message == "You are already verified on LeetCode!") {
          window.location.reload();
        }
      }

    } catch (err) {
      console.log("Verification Error :", err);
    }
  }

  const handleLeetVerification = () => {
    setSelectedUser(localStorage.getItem("userID"));
    handleLeetCodeVerification();
    setShowLeetVerificationCard(true);
  }



  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleViewProfile = () => {
    console.log('Viewing profile...');
    setShowProfileDropdown(false);
  };

  const handleSuggestionClick = (user) => {
    setSelectedUser(user);
    fetchOtherUserProfile(user);
    setShowProfileCard(true);
  };

  const closeProfile = () => {
    setShowProfileCard(false);
    setSelectedUser(null);
    console.log(showProfileCard);
  };

  const closeNotifications = () => {
    setShowNotifications(false);
    // setSelectedUser(null);
    console.log(showProfileCard);
  };

  const closeLeetVerification = () => {
    setShowLeetVerificationCard(false);
    setSelectedUser(null);
    // console.log(showProfileCard);
  };

  useEffect(() => {
    fetchProfile();

  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0f0f0f',
        color: '#e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem'
      }}>
        Loading...
      </div>
    );
  }

  const styles = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .navbar {
    width:100vw;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2.5rem;
      background-color: #1a1a1a;
      border-bottom: 1px solid #2a2a2a;
    }


    

    .navbar-left {
      display: flex;
      align-items: center;
      gap: 2rem;
      flex: 1;
    }
    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-weight: 600;
      font-size: 1.35rem;
      color: #00d9ff;
      text-decoration: none;
    }
    .logo-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #1e3a5f, #0a4d6e);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #00d9ff;
    }
    .search-container {
      flex: 1;
      max-width: 500px;
      position: relative;
    }
    .search-box {
      width: 100%;
      padding: 0.65rem 1rem 0.65rem 2.75rem;
      background-color: #2a2a2a;
      border: 1px solid #3a3a3a;
      border-radius: 8px;
      color: #e0e0e0;
      font-size: 0.95rem;
      outline: none;
      transition: border-color 0.3s;
    }
    .search-box:focus {
      border-color: #00d9ff;
    }
    .search-box::placeholder {
      color: #808080;
    }
    .search-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #808080;
      pointer-events: none;
    }
    .search-dropdown {
      position: absolute;
      top: calc(100% + 0.5rem);
      left: 0;
      right: 0;
      background-color: #1a1a1a;
      border: 1px solid #2a2a2a;
      border-radius: 8px;
      padding: 0.5rem;
      z-index: 1000;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
      max-height: 300px;
      overflow-y: auto;
    }
    .navbar-right {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    .notification-btn {
      position: relative;
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background-color: #2a2a2a;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #e0e0e0;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    .notification-btn:hover {
      background-color: #333;
    }
    .notification-badge {
      position: absolute;
      top: -4px;
      right: -4px;
      width: 20px;
      height: 20px;
      background-color: #00d9ff;
      color: #000;
      border-radius: 50%;
      font-size: 0.75rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .profile-btn {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background-color: #00d9ff;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #000;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: transform 0.3s;
    }
    .profile-btn:hover {
      transform: scale(1.05);
    }
    .profile-wrapper {
      position: relative;
    }
    .profile-name {
      color: #e0e0e0;
      font-weight: 500;
    }
    .profile-dropdown {
      position: absolute;
      top: 50px;
      right: 0;
      background-color: #1a1a1a;
      border: 1px solid #2a2a2a;
      border-radius: 8px;
      min-width: 200px;
      padding: 0.5rem 0;
      z-index: 1000;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    }
    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.85rem 1.25rem;
      color: #e0e0e0;
      background: transparent;
      border: none;
      width: 100%;
      text-align: left;
      cursor: pointer;
      transition: background-color 0.3s;
      font-size: 0.95rem;
    }
    .dropdown-item:hover {
      background-color: #2a2a2a;
    }
    .notification-dropdown {
      position: absolute;
      top: 50px;
      right: 0;
      background-color: #1a1a1a;
      border: 1px solid #2a2a2a;
      border-radius: 8px;
      min-width: 280px;
      padding: 1rem;
      z-index: 1000;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    }
    .notification-item {
      padding: 0.75rem;
      border-bottom: 1px solid #2a2a2a;
      color: #e0e0e0;
      font-size: 0.9rem;
    }
    .notification-item:last-child {
      border-bottom: none;
    }
    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 3rem 2.5rem;
    }
    .welcome-section {
      margin-bottom: 3rem;
    }
    .welcome-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #00d9ff;
      font-size: 0.9rem;
      font-weight: 500;
      margin-bottom: 0.75rem;
    }
    .welcome-title {
      font-size: 3rem;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .username-highlight {
      color: #00d9ff;
    }
    .welcome-subtitle {
      color: #a0a0a0;
      font-size: 1.1rem;
    }
    .user-result {
      padding: 0.75rem 1rem;
      background-color: #2a2a2a;
      border-radius: 6px;
      margin-bottom: 0.25rem;
      color: #e0e0e0;
      cursor: pointer;
      transition: background-color 0.3s;
      font-size: 0.9rem;
    }
    .user-result:hover {
      background-color: #333;
    }
    .user-result:last-child {
      margin-bottom: 0;
    }
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      margin-bottom: 4rem;
    }
    .action-card {
      background: linear-gradient(135deg, #1a1a1a, #252525);
      border: 1px solid #2a2a2a;
      border-radius: 16px;
      padding: 2rem;
      cursor: pointer;
      transition: all 0.3s;
    }
    .action-card:hover {
      transform: translateY(-4px);
      border-color: #3a3a3a;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    }
    .card-icon-wrapper {
      width: 64px;
      height: 64px;
      margin-bottom: 1.5rem;
      border-radius: 12px;
      background: linear-gradient(135deg, #1e3a5f, #0a4d6e);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #ffffff;
      margin-bottom: 0.5rem;
      font-family: 'Courier New', monospace;
    }
    .card-text {
      color: #a0a0a0;
      line-height: 1.5;
      font-size: 0.95rem;
    }
    .sections-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    .section-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #ffffff;
    }
    .section-count {
      color: #a0a0a0;
      font-size: 0.95rem;
    }
    .section-subtitle {
      color: #a0a0a0;
      font-size: 0.9rem;
      margin-bottom: 1rem;
      margin-top: -0.5rem;
    }
    .list-item {
      background-color: #1a1a1a;
      border: 1px solid #2a2a2a;
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1rem;
      transition: all 0.3s;
      cursor: pointer;
      position: relative;
    }
    .list-item:hover {
      background-color: #252525;
      border-color: #3a3a3a;
    }
    .list-item-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.75rem;
    }
    .list-item-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #ffffff;
      font-family: 'Courier New', monospace;
    }
    .status-indicator {
      width: 8px;
      height: 8px;
      background-color: #4ade80;
      border-radius: 50%;
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
    }
    .badge {
      display: inline-block;
      padding: 0.35rem 0.85rem;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 600;
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
    .badge-pending {
      background-color: #4d3a1a;
      color: #fbbf24;
    }
    .badge-completed {
      background-color: #1e3a5f;
      color: #60a5fa;
    }
    .list-item-meta {
      display: flex;
      gap: 1.5rem;
      color: #a0a0a0;
      font-size: 0.9rem;
    }
    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.35rem;
    }
    .show-more-btn {
      width: 100%;
      padding: 0.85rem;
      background-color: #1a1a1a;
      border: 1px solid #2a2a2a;
      border-radius: 8px;
      color: #e0e0e0;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.3s;
      margin-top: 0.5rem;
    }
    .show-more-btn:hover {
      background-color: #252525;
      border-color: #3a3a3a;
    }
    @media (max-width: 1024px) {
      .sections-container {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
      .cards-grid {
        grid-template-columns: 1fr;
      }
    }
    @media (max-width: 768px) {
      .navbar {
        flex-direction: column;
        gap: 1rem;
      }
      .navbar-left {
        width: 100%;
        flex-direction: column;
        gap: 1rem;
      }
      .search-container {
        width: 100%;
        max-width: 100%;
      }
    }
  `;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f0f0f',
      color: '#e0e0e0'
    }}>
      <style>{styles}</style>

      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <a className="navbar-brand" href="#">
            <div className="logo-icon">
              <Code size={24} />
            </div>
            CodeVerse
          </a>

          <div className="search-container">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              className="search-box"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                searchUsers(e.target.value);
              }}
            />


            {searchQuery && realUsers.length > 0 && (
              <div className="search-dropdown bg-secondary p-2 rounded">
                {realUsers.map((u, idx) => (
                  <div
                    key={u._id}
                    className="user-result p-2 bg-dark text-light mb-1 rounded"
                    onClick={() => handleSuggestionClick(u._id)}
                    style={{ cursor: "pointer" }}
                  >
                    {u.username}
                  </div>
                ))}
              </div>
            )}

            {showProfileCard && (<UserProfile user={selectedUser} onClose={closeProfile} ReceiverID={selectedUser} />)}



          </div>
        </div>

        <div className="navbar-right">
          <div style={{ position: 'relative' }}>
            <button
              className="notification-btn"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={20} />
              <div className="notification-badge">3</div>
            </button>

            {showNotifications && (
              <Notifications onClose={closeNotifications} />
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="profile-wrapper">
              <button
                className="profile-btn"
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              >
                {user?.username?.[0]?.toUpperCase() || 'D'}
              </button>

              {showProfileDropdown && (
                <div className="profile-dropdown">
                  <button className="dropdown-item" onClick={handleViewProfile}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    View Profile
                  </button>

                  <button className="dropdown-item" onClick={handleLeetVerification}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    Verify Leetcode
                  </button>

                  {showLeetVerificationCard && (<LeetCodeVerification onClose={closeLeetVerification} verificationCode={verificationCode} userId={selectedUser} />)}

                  <button className="dropdown-item" onClick={handleLogout}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
            <span className="profile-name">{user?.username || 'Developer'}</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container">
        {/* Welcome Section */}
        <div className="welcome-section">
          <div className="welcome-label">
            <span>✨</span>
            Welcome back
          </div>
          <h1 className="welcome-title">
            Hey, <span className="username-highlight">{user?.username || 'Developer'}</span>! 👋
          </h1>
          <p className="welcome-subtitle">Ready to crush some coding challenges today?</p>
        </div>

        {/* Action Cards */}
        <div className="cards-grid">
          <div
            className="action-card"
            onClick={() => navigate("/challenge")}
            style={{ cursor: "pointer" }}
          >
            <div className="card-icon-wrapper">
              <span style={{ fontSize: "2rem" }}>🎯</span>
            </div>
            <h5 className="card-title">Start a Challenge</h5>
            <p className="card-text">
              Begin a new challenge and compete with others
            </p>
          </div>

          <div className="action-card">
            <div className="card-icon-wrapper">
              <span style={{ fontSize: '2rem' }}>🚪</span>
            </div>
            <h5 className="card-title">Join a Room</h5>
            <p className="card-text">Enter an existing room with a code</p>
          </div>

          <div className="action-card">
            <div className="card-icon-wrapper">
              <span style={{ fontSize: '2rem' }}>➕</span>
            </div>
            <h5 className="card-title">Create Room</h5>
            <p className="card-text">Host a new room for your friends</p>
          </div>
        </div>

        {/* My Rooms and My Challenges */}
        <div className="sections-container">
          {/* My Rooms */}
          <div>
            <div className="section-header">
              <h3 className="section-title">My Rooms</h3>
              <span className="section-count">{activeRoomsCount} active</span>
            </div>
            {displayedRooms.map(room => (
              <div key={room.id} className="list-item">
                <div className="status-indicator"></div>
                <div className="list-item-header">
                  <h4 className="list-item-title">{room.name}</h4>
                </div>
                <div className="list-item-meta">
                  <span className="meta-item">
                    <span>👥</span> {room.members} members
                  </span>
                  <span className="meta-item">
                    <span>🕐</span> {room.lastActive}
                  </span>
                </div>
              </div>
            ))}
            {myRooms.length > 2 && (
              <button
                className="show-more-btn"
                onClick={() => setShowAllRooms(!showAllRooms)}
              >
                {showAllRooms ? 'Show Less' : `Show More (${myRooms.length - 2} more)`}
              </button>
            )}
          </div>

          {/* My Challenges */}
          <div>
            <div className="section-header">
              <h3 className="section-title">My Challenges</h3>
              <span className="section-count">{pendingChallengesCount} pending</span>
            </div>
            <p className="section-subtitle">LeetCode problems from friends</p>
            {displayedChallenges.map(challenge => (
              <div key={challenge.id} className="list-item">
                <div className="list-item-header">
                  <h4 className="list-item-title">{challenge.title}</h4>
                  <span className={`badge badge-${challenge.difficulty.toLowerCase()}`}>
                    {challenge.difficulty}
                  </span>
                </div>
                <div className="list-item-meta">
                  <span className="meta-item">
                    <span>👤</span> From {challenge.friend}
                  </span>
                  <span className={`badge badge-${challenge.status.toLowerCase()}`}>
                    {challenge.status}
                  </span>
                </div>
              </div>
            ))}
            {myChallenges.length > 2 && (
              <button
                className="show-more-btn"
                onClick={() => setShowAllChallenges(!showAllChallenges)}
              >
                {showAllChallenges ? 'Show Less' : `Show More (${myChallenges.length - 2} more)`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}