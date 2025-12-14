import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Copy, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LeetCodeVerification({ onClose, verificationCode, userId }) {
  const [leetcodeUsername, setLeetcodeUsername] = useState(userId?.email||"");
  const [isVerified, setIsVerified] = useState(false);
  const [verifiedUsername, setVerifiedUsername] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

const navigate=useNavigate()
  // Check if user is already verified on component mount
  // useEffect(() => {
  //   checkVerificationStatus();
  // }, [userId]);

  // const checkVerificationStatus = async (userId) => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     const response = await fetch(`http://localhost:5000/users/verifyleet`, {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     const data = await response.json();
  //     if (data.isVerified) {
  //       setIsVerified(true);
  //       setVerifiedUsername(data.leetcodeUsername);
  //     }
  //   } catch (error) {
  //     console.log("Verification status check error:", error);
  //   }
  // };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(verificationCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = async () => {
    const token = localStorage.getItem("token");
    console.log(token);
  const res = await fetch("http://localhost:5000/users/verifyleet", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    body: JSON.stringify({
      userId: userId,
      leetUsername : leetcodeUsername
    })
  });

  const data = await res.json();
 console.log(data);
 
  alert(data.msg);
   if(data?.message=="You are already verified on LeetCode!"){
    onClose()
  }
};

  const styles = `
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
    .verification-card {
      background-color: #0f0f0f;
      border: 1px solid #2a2a2a;
      border-radius: 16px;
      max-width: 550px;
      width: 100%;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
      position: relative;
      overflow: hidden;
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
    .card-header {
      background: linear-gradient(135deg, #1a1a1a, #252525);
      border-bottom: 1px solid #2a2a2a;
      padding: 2rem;
      text-align: center;
    }
    .leetcode-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 1rem;
      border-radius: 50%;
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      border: 3px solid #2a2a2a;
    }
    .card-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 0.5rem;
    }
    .card-subtitle {
      color: #a0a0a0;
      font-size: 0.95rem;
    }
    .card-content {
      padding: 2rem;
    }
    .verified-section {
      text-align: center;
      padding: 2rem 0;
    }
    .verified-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 1.5rem;
      border-radius: 50%;
      background: linear-gradient(135deg, #1a4d2e, #0d3d1f);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #4ade80;
    }
    .verified-text {
      font-size: 1.5rem;
      font-weight: 700;
      color: #4ade80;
      margin-bottom: 0.5rem;
    }
    .verified-username {
      font-size: 1.1rem;
      color: #e0e0e0;
      font-family: 'Courier New', monospace;
    }
    .input-group {
      margin-bottom: 1.5rem;
    }
    .input-label {
      display: block;
      color: #e0e0e0;
      font-weight: 600;
      margin-bottom: 0.5rem;
      font-size: 0.95rem;
    }
    .input-field {
      width: 100%;
      padding: 0.85rem 1rem;
      background-color: #1a1a1a;
      border: 1px solid #2a2a2a;
      border-radius: 8px;
      color: #e0e0e0;
      font-size: 0.95rem;
      outline: none;
      transition: border-color 0.3s;
    }
    .input-field:focus {
      border-color: #fbbf24;
    }
    .input-field::placeholder {
      color: #808080;
    }
    .code-section {
      background: linear-gradient(135deg, #1a1a1a, #252525);
      border: 1px solid #2a2a2a;
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }
    .code-label {
      color: #a0a0a0;
      font-size: 0.9rem;
      margin-bottom: 0.75rem;
      font-weight: 500;
    }
    .code-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: #0f0f0f;
      border: 1px solid #3a3a3a;
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 1rem;
    }
    .code-text {
      color: #fbbf24;
      font-family: 'Courier New', monospace;
      font-size: 1rem;
      font-weight: 600;
      flex: 1;
    }
    .copy-btn {
      background-color: #1a1a1a;
      border: 1px solid #2a2a2a;
      color: #e0e0e0;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      transition: all 0.3s;
    }
    .copy-btn:hover {
      background-color: #252525;
      border-color: #3a3a3a;
    }
    .copy-btn.copied {
      background-color: #1a4d2e;
      border-color: #2a5f3a;
      color: #4ade80;
    }
    .instruction-text {
      color: #a0a0a0;
      font-size: 0.9rem;
      line-height: 1.6;
    }
    .verify-btn {
      width: 100%;
      padding: 1rem;
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
      border: none;
      border-radius: 8px;
      color: #000;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s;
    }
    .verify-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
    }
    .verify-btn:disabled {
      background: #2a2a2a;
      color: #808080;
      cursor: not-allowed;
      transform: none;
    }
    .error-message {
      background-color: #4d1a1a;
      border: 1px solid #7a2828;
      color: #f87171;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      font-size: 0.9rem;
    }
    @media (max-width: 768px) {
      .card-header {
        padding: 1.5rem;
      }
      .card-content {
        padding: 1.5rem;
      }
      .card-title {
        font-size: 1.5rem;
      }
    }
  `;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <style>{styles}</style>
      
      <div className="verification-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="card-header">
          <div className="leetcode-icon">
            <span>💻</span>
          </div>
          <h2 className="card-title">LeetCode Verification</h2>
          <p className="card-subtitle">
            {isVerified ? 'Your account is verified' : 'Verify your LeetCode account'}
          </p>
        </div>

        <div className="card-content">
          {isVerified ? (
            // Verified State
            <div className="verified-section">
              <div className="verified-icon">
                <CheckCircle size={40} />
              </div>
              <div className="verified-text">✓ Verified</div>
              <div className="verified-username">@{verifiedUsername}</div>
            </div>
          ) : (
            // Verification Form
            <>
              <div className="input-group">
                <label className="input-label">LeetCode Username</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter your LeetCode username"
                  value={leetcodeUsername}
                  onChange={(e) => setLeetcodeUsername(e.target.value)}
                />
              </div>

              <div className="code-section">
                <div className="code-label">Your Verification Code</div>
                <div className="code-box">
                  <span className="code-text">{verificationCode}</span>
                  <button 
                    className={`copy-btn ${copied ? 'copied' : ''}`}
                    onClick={handleCopyCode}
                  >
                    {copied ? (
                      <>
                        <Check size={16} />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <p className="instruction-text">
                  📝 Add this code to your LeetCode bio and click verify to get verified.
                </p>
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <button 
                className="verify-btn"
                onClick={handleVerify}
                disabled={isVerifying}
              >
                {isVerifying ? 'Verifying...' : 'Verify Account'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}