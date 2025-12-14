import React, { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      console.log(data);

      if (!response.ok) {
        alert(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userID", data.user._id);

      alert("Login successful!");

      console.log('Ho rha h ')

      window.location.href = "/home";

    } catch (error) {
      console.error("Login Error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <>
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
        rel="stylesheet"
      />
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes particle {
          0% {
            transform: translateY(100vh) translateX(0) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) translateX(50px) scale(1);
            opacity: 0;
          }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        @keyframes buttonGlow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(113, 128, 150, 0.6),
                        0 5px 25px rgba(113, 128, 150, 0.4); 
          }
          50% { 
            box-shadow: 0 0 40px rgba(113, 128, 150, 0.9),
                        0 5px 35px rgba(113, 128, 150, 0.6); 
          }
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body, html {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }

        .auth-bg {
          background: linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2d2d2d 100%);
          position: relative;
          overflow: hidden;
          min-height: 100vh;
          width: 100vw;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 1rem;
        }

        .particle {
          display: none;
        }

        .auth-card {
          background-color: rgba(0, 0, 0, 0.85) !important;
          backdrop-filter: blur(10px);
          border: 2px solid #4a5568 !important;
          border-radius: 20px !important;
          width: 100%;
          max-width: 450px;
          position: relative;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
          animation: slideIn 0.5s ease-out;
        }

        .auth-card::before {
          display: none;
        }

        .auth-card h3 {
          background: linear-gradient(135deg, #718096 0%, #a0aec0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-size: 1.75rem;
        }

        .auth-card h3 span {
          display: inline-block;
        }

        .form-label {
          color: #a0aec0 !important;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          font-size: 14px;
          margin-bottom: 0.5rem;
        }

        .form-control {
          background-color: rgba(26, 32, 44, 0.6) !important;
          border: 2px solid #4a5568 !important;
          color: #ffffff !important;
          border-radius: 10px !important;
          padding: 14px 18px;
          transition: all 0.3s ease;
          box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.3);
          font-size: 16px;
        }

        .form-control:focus {
          background-color: rgba(45, 55, 72, 0.7) !important;
          border-color: #718096 !important;
          box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.3) !important;
          color: #ffffff !important;
          outline: none !important;
        }

        .auth-btn {
          background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%) !important;
          border: none !important;
          color: #ffffff !important;
          font-weight: bold;
          padding: 16px;
          border-radius: 10px !important;
          font-size: 18px;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
          width: 100%;
        }

        .auth-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5) !important;
        }

        .auth-btn:active {
          transform: translateY(0px);
        }

        .auth-card p {
          color: #ffffff;
          margin-bottom: 0;
        }

        .auth-card a {
          color: #a0aec0;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .auth-card a:hover {
          color: #cbd5e0;
        }

        /* Tablet styles */
        @media (max-width: 768px) {
          .auth-card {
            max-width: 500px;
            padding: 2rem !important;
          }

          .auth-card h3 {
            font-size: 1.5rem;
          }

          .form-control {
            padding: 12px 16px;
            font-size: 15px;
          }

          .auth-btn {
            padding: 14px;
            font-size: 16px;
          }

          .form-label {
            font-size: 13px;
          }
        }

        /* Mobile styles */
        @media (max-width: 480px) {
          .auth-bg {
            padding: 1rem 0.75rem;
          }

          .auth-card {
            max-width: 100%;
            padding: 1.5rem !important;
            border-radius: 15px !important;
          }

          .auth-card h3 {
            font-size: 1.35rem;
            margin-bottom: 1.5rem !important;
          }

          .form-control {
            padding: 12px 14px;
            font-size: 14px;
            border-radius: 8px !important;
          }

          .auth-btn {
            padding: 12px;
            font-size: 15px;
            border-radius: 8px !important;
          }

          .form-label {
            font-size: 12px;
          }

          .mb-3 {
            margin-bottom: 1rem !important;
          }

          .mt-2 {
            margin-top: 1rem !important;
          }

          .mt-3 {
            margin-top: 1.25rem !important;
          }

          .auth-card p {
            font-size: 14px;
          }
        }

        /* Extra small devices */
        @media (max-width: 360px) {
          .auth-bg {
            padding: 0.5rem;
          }

          .auth-card {
            padding: 1.25rem !important;
          }

          .auth-card h3 {
            font-size: 1.2rem;
          }

          .form-control {
            padding: 10px 12px;
            font-size: 13px;
          }

          .auth-btn {
            padding: 10px;
            font-size: 14px;
          }
        }
      `}</style>

      <div className="auth-bg">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}

        <div className="card shadow-lg p-4 auth-card">
          <h3 className="text-center mb-3 fw-bold">Welcome Back <span>👋</span></h3>

          <div onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button onClick={handleSubmit} className="btn btn-primary w-100 mt-2 auth-btn">
              Login
            </button>
          </div>

          <p className="text-center mt-3">
            Don't have an account? <a href="/register">Register</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;