import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Send, Trophy, Clock, CheckCircle, XCircle, User } from 'lucide-react';

export default function ChallengePage() {
  const [friends, setFriends] = useState([]);
  const [leetcodeProblems, setLeetcodeProblems] = useState([]);
  const [sentChallenges, setSentChallenges] = useState([]);
  const [receivedChallenges, setReceivedChallenges] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('create');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
  console.log("Updated sentChallenges:", sentChallenges);
}, [sentChallenges]);


  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

     
      const friendsRes = await fetch("http://localhost:5000/challenge/friends", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const friendsData = await friendsRes.json();
      console.log(friendsData);
      if (friendsData.success) setFriends(friendsData.friends);

      
      const problemsRes = await fetch("http://localhost:5000/challenge/problems", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const problemsData = await problemsRes.json();
      console.log(problemsData);
      if (problemsData.success) setLeetcodeProblems(problemsData.data);
      console.log("Ye dekho beta :",leetcodeProblems);

      
      const sentRes = await fetch("http://localhost:5000/challenge/sent", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const sentData = await sentRes.json();
      if (sentData.success) setSentChallenges(sentData.challenges.challengesSent);
      

     
      const receivedRes = await fetch("http://localhost:5000/challenge/received", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const receivedData = await receivedRes.json();
      console.log("YE dekh",receivedData);
      if (receivedData.success) setReceivedChallenges(receivedData.challenges.challengesReceived);

    } catch (error) {
      console.log("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };


  const sampleReceivedChallenges = [
    { id: 1, from: 'alex_coder', problem: 'Merge K Sorted Lists', difficulty: 'Hard', status: 'pending', receivedAt: '3 hours ago' },
    { id: 2, from: 'emma_tech', problem: 'Valid Parentheses', difficulty: 'Easy', status: 'accepted', receivedAt: '5 hours ago' },
  ];

  const displayFriends = friends;
  const displayProblems =  leetcodeProblems ;
  const displaySent = sentChallenges;
  const displayReceived =  receivedChallenges;

  const filteredProblems = displayProblems.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
function toKebabCase(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-');
}
const toSlug = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, "") // remove special chars
    .replace(/\s+/g, "-");

const handleVerify = async (name) => {
  try {
    const token = localStorage.getItem("token");
    const challengeSlug = toSlug(name);
console.log(challengeSlug);

    const response = await fetch(
      "http://localhost:5000/challenge/submissions",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const s= await response.json()
    const submissions=s?.submissions;
    console.log("Submissions:", submissions);

    // Find a recent ACCEPTED submission that matches the challenge
    const solved = submissions.some((submission) => {
      if (submission.status !== 10) return false; // not Accepted

      // flexible match
      return (
        submission.titleSlug.includes(challengeSlug) ||
        challengeSlug.includes(submission.titleSlug)
      );
    });

    if (solved) {
      console.log("✅ Challenge solved!");
      return true;
    } else {
      console.log("❌ Challenge not solved yet");
      return false;
    }
  } catch (error) {
    console.log("Verify challenge error:", error);
    return false;
  }
};

  const handleSendChallenge = async () => {
    if (!selectedFriend || !selectedProblem) {
      alert('Please select a friend and a problem');
      return;
    }

    try {
      const token = localStorage.getItem("token");
      console.log(selectedProblem);
      console.log(selectedFriend);
      const response = await fetch("http://localhost:5000/challenge/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          friendId: selectedFriend._id,
          problemId: selectedProblem.id,
          title: selectedProblem.title,
          difficulty:selectedProblem.difficulty,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Challenge sent successfully!');
        setSelectedFriend(null);
        setSelectedProblem(null);
        fetchData();
      }
    } catch (error) {
      console.log("Send challenge error:", error);
    }
  };

  const styles = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .challenge-page {
      min-height: 100vh;
      width:100vw;
      background-color: #0f0f0f;
      color: #e0e0e0;
    }
    .header {
      background-color: #1a1a1a;
      border-bottom: 1px solid #2a2a2a;
      padding: 1.5rem 2rem;
    }
    .header-content {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .back-btn {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background-color: #2a2a2a;
      border: none;
      color: #e0e0e0;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.3s;
    }
    .back-btn:hover {
      background-color: #333;
    }
    .page-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: #ffffff;
    }
    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }
    .tabs {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      border-bottom: 1px solid #2a2a2a;
    }
    .tab {
      padding: 1rem 1.5rem;
      background: transparent;
      border: none;
      color: #a0a0a0;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      border-bottom: 3px solid transparent;
      transition: all 0.3s;
    }
    .tab:hover {
      color: #e0e0e0;
    }
    .tab.active {
      color: #00d9ff;
      border-bottom-color: #00d9ff;
    }
    .grid-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
    }
    .section {
      background: linear-gradient(135deg, #1a1a1a, #252525);
      border: 1px solid #2a2a2a;
      border-radius: 16px;
      padding: 1.5rem;
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    .section-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #ffffff;
    }
    .search-box {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 2.5rem;
      background-color: #0f0f0f;
      border: 1px solid #2a2a2a;
      border-radius: 8px;
      color: #e0e0e0;
      font-size: 0.95rem;
      outline: none;
      margin-bottom: 1rem;
    }
    .search-box:focus {
      border-color: #00d9ff;
    }
    .search-wrapper {
      position: relative;
    }
    .search-icon {
      position: absolute;
      left: 0.75rem;
      top: 0.85rem;
      color: #808080;
    }
    .list {
      max-height: 400px;
      overflow-y: auto;
    }
    .list::-webkit-scrollbar {
      width: 6px;
    }
    .list::-webkit-scrollbar-track {
      background: #1a1a1a;
    }
    .list::-webkit-scrollbar-thumb {
      background: #3a3a3a;
      border-radius: 3px;
    }
    .list-item {
      padding: 1rem;
      background-color: #0f0f0f;
      border: 1px solid #2a2a2a;
      border-radius: 8px;
      margin-bottom: 0.75rem;
      cursor: pointer;
      transition: all 0.3s;
    }
    .list-item:hover {
      background-color: #1a1a1a;
      border-color: #3a3a3a;
    }
    .list-item.selected {
      background-color: #1a3a4f;
      border-color: #00d9ff;
    }
    .friend-item {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .friend-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #00d9ff, #0a7ea4);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      color: #000;
    }
    .friend-name {
      font-weight: 600;
      color: #ffffff;
    }
    .problem-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .problem-info {
      flex: 1;
    }
    .problem-number {
      color: #808080;
      font-size: 0.9rem;
      margin-bottom: 0.25rem;
    }
    .problem-title {
      font-weight: 600;
      color: #ffffff;
      font-size: 0.95rem;
    }
    .badge {
      display: inline-block;
      padding: 0.35rem 0.75rem;
      border-radius: 6px;
      font-size: 0.75rem;
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
    .badge-accepted {
      background-color: #1a4d2e;
      color: #4ade80;
    }
    .send-section {
      background: linear-gradient(135deg, #1a1a1a, #252525);
      border: 1px solid #2a2a2a;
      border-radius: 16px;
      padding: 2rem;
      text-align: center;
    }
    .selection-display {
      display: flex;
      gap: 2rem;
      justify-content: center;
      margin-bottom: 2rem;
    }
    .selection-card {
      flex: 1;
      max-width: 250px;
      padding: 1.5rem;
      background-color: #0f0f0f;
      border: 1px solid #2a2a2a;
      border-radius: 12px;
    }
    .selection-label {
      color: #808080;
      font-size: 0.85rem;
      margin-bottom: 0.75rem;
      text-transform: uppercase;
    }
    .selection-value {
      color: #ffffff;
      font-weight: 600;
      font-size: 1.1rem;
    }
    .send-btn {
      padding: 1rem 3rem;
      background: linear-gradient(135deg, #00d9ff, #0a7ea4);
      border: none;
      border-radius: 10px;
      color: #000;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s;
    }
    .send-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 217, 255, 0.3);
    }
    .send-btn:disabled {
      background: #2a2a2a;
      color: #808080;
      cursor: not-allowed;
      transform: none;
    }
    .challenge-item {
      padding: 1.5rem;
      background-color: #0f0f0f;
      border: 1px solid #2a2a2a;
      border-radius: 12px;
      margin-bottom: 1rem;
    }
    .challenge-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }
    .challenge-user {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .user-avatar-small {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, #00d9ff, #0a7ea4);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.9rem;
      color: #000;
    }
    .challenge-problem {
      font-weight: 600;
      color: #ffffff;
      margin-bottom: 0.5rem;
    }
    .challenge-meta {
      display: flex;
      gap: 1rem;
      color: #808080;
      font-size: 0.9rem;
    }
    .empty-state {
      text-align: center;
      padding: 3rem 2rem;
      color: #808080;
    }
    @media (max-width: 1024px) {
      .grid-container {
        grid-template-columns: 1fr;
      }
    }
    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }
      .header {
        padding: 1rem;
      }
      .page-title {
        font-size: 1.5rem;
      }
      .tabs {
        overflow-x: auto;
      }
      .tab {
        padding: 0.75rem 1rem;
        font-size: 0.9rem;
      }
      .selection-display {
        flex-direction: column;
        gap: 1rem;
      }
      .selection-card {
        max-width: 100%;
      }
    }
  `;

  return (
    <div className="challenge-page">
      <style>{styles}</style>

      {/* Header */}
      <div className="header">
        <div className="header-content">
          <button className="back-btn" onClick={() => window.history.back()}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="page-title">🏆 Challenges</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container">
        {/* Tabs */}
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            Create Challenge
          </button>
          <button 
            className={`tab ${activeTab === 'sent' ? 'active' : ''}`}
            onClick={() => setActiveTab('sent')}
          >
            Sent ({displaySent.length})
          </button>
          <button 
            className={`tab ${activeTab === 'received' ? 'active' : ''}`}
            onClick={() => setActiveTab('received')}
          >
            Received ({displayReceived.length})
          </button>
        </div>

        {/* Create Challenge Tab */}
        {activeTab === 'create' && (
          <>
            <div className="grid-container">
              {/* Friends List */}
              <div className="section">
                <div className="section-header">
                  <h2 className="section-title">Select Friend</h2>
                  <span style={{ color: '#808080', fontSize: '0.9rem' }}>{displayFriends.length} friends</span>
                </div>
                <div className="list">
                  {displayFriends.map(friend => (
                    <div 
                      key={friend._id}
                      className={`list-item friend-item ${selectedFriend?.id === friend.id ? 'selected' : ''}`}
                      onClick={() => setSelectedFriend(friend)}
                    >
                      <div className="friend-avatar">{friend.username[0].toUpperCase()}</div>
                      <div className="friend-name">{friend.username}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* LeetCode Problems */}
              <div className="section">
                <div className="section-header">
                  <h2 className="section-title">Select Problem</h2>
                  <span style={{ color: '#808080', fontSize: '0.9rem' }}>{displayProblems.length} problems</span>
                </div>
                <div className="search-wrapper">
                  <Search className="search-icon" size={18} />
                  <input
                    type="text"
                    className="search-box"
                    placeholder="Search problems..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="list">
                  {filteredProblems.map(problem => (
                    <div 
                      key={problem.id}
                      className={`list-item problem-item ${selectedProblem?.id === problem.id ? 'selected' : ''}`}
                      onClick={() => setSelectedProblem(problem)}
                    >
                      <div className="problem-info">
                        <div className="problem-number">#{problem.id}</div>
                        <div className="problem-title">{problem.title}</div>
                      </div>
                      <span className={`badge badge-${problem.difficulty.toLowerCase()}`}>
                        {problem.difficulty}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Send Challenge Section */}
            <div className="send-section">
              <div className="selection-display">
                <div className="selection-card">
                  <div className="selection-label">Challenging</div>
                  <div className="selection-value">
                    {selectedFriend ? selectedFriend.username : 'Select a friend'}
                  </div>
                </div>
                <div className="selection-card">
                  <div className="selection-label">Problem</div>
                  <div className="selection-value">
                    {selectedProblem ? selectedProblem.title : 'Select a problem'}
                  </div>
                </div>
              </div>
              <button 
                className="send-btn"
                onClick={handleSendChallenge}
                disabled={!selectedFriend || !selectedProblem}
              >
                <Send size={20} />
                Send Challenge
              </button>
            </div>
          </>
        )}

        {/* Sent Challenges Tab */}
        {activeTab === 'sent' && (
          <div className="section">
            <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>Challenges You Sent</h2>
            {displaySent.length === 0 ? (
              <div className="empty-state">
                <Trophy size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                <div>No challenges sent yet</div>
              </div>
            ) : (
              displaySent.map(challenge => (
                <div key={challenge._id} className="challenge-item">
                  <div className="challenge-header">
                    <div className="challenge-user">
                      <div className="user-avatar-small">{challenge.participants[1].userId.username[0].toUpperCase()}</div>
                      <span style={{ color: '#e0e0e0', fontWeight: 600 }}>To: {challenge.participants[1].userId.username}</span>
                    </div>
                    <span className={`badge badge-${challenge.status}`}>{challenge.status}</span>
                  </div>
                  <div className="challenge-problem">{challenge.title}</div>
                  <div className="challenge-meta">
                    <span className={`badge badge-${challenge.difficulty.toLowerCase()}`}>
                      {challenge.difficulty}
                    </span>
                    <span>
                      <Clock size={14} style={{ verticalAlign: 'middle', marginRight: '0.25rem' }} />
                      {new Date(challenge.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Received Challenges Tab */}
        {activeTab === 'received' && (
          <div className="section">
            <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>Challenges You Received</h2>
            {displayReceived.length === 0 ? (
              <div className="empty-state">
                <Trophy size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                <div>No challenges received yet</div>
              </div>
            ) : (
              displayReceived.map(challenge => (
                <div key={challenge._id} className="challenge-item">
                  <div className="challenge-header">
                    <div className="challenge-user">
                      <div className="user-avatar-small">{challenge.participants[1].userId.username[0].toUpperCase()}</div>
                      <span style={{ color: '#e0e0e0', fontWeight: 600 }}>From: {challenge.participants[0].userId.username}</span>
                    </div>
                    <span className={`badge badge-${challenge.status}`}>{challenge.status}</span>
                  </div>
                  <div className="challenge-problem">{challenge.title}</div>
                  <div className="challenge-meta">
                    <span className={`badge badge-${challenge.difficulty.toLowerCase()}`}>
                      {challenge.difficulty}
                    </span>
                    <span>
                      <Clock size={14} style={{ verticalAlign: 'middle', marginRight: '0.25rem' }} />
                      {challenge.receivedAt || "Invalid"}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <a href={`https://leetcode.com/problems/${toKebabCase(challenge?.title)}`} className='bg-blue-500 p-2 my-5'>
                      Redirect
                    </a>
                      <button onClick={()=>{handleVerify(challenge?.title)}} className='bg-blue-500 p-2 my-5'>
                      Verify
                    </button>
                    </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}