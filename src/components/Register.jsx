import React, { useState } from "react";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent page reload

    console.log("Register:", { username, email, password });

    // Basic validation
    if (!username || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      alert("Registration successful!");

      // OPTIONAL → Save token (if backend sends)
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // OPTIONAL → Redirect
      // window.location.href = "/login";

    } catch (error) {
      console.error("Registration Error:", error);
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
        .particle {
          display: none;
        }

        .auth-bg {
          background: linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2d2d2d 100%);
          position: relative;
          overflow: hidden;
          min-height: 100vh;
          min-width:100vw;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0;
        }

        .auth-card {
          background-color: rgba(0, 0, 0, 0.85) !important;
          backdrop-filter: blur(10px);
          border: 2px solid #4a5568 !important;
          border-radius: 20px !important;
          max-width: 100%;
          width: 25%;
          position: relative;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        }

        .auth-card::before {
          display: none;
        }

        .auth-card h3 {
          background: linear-gradient(135deg, #718096 0%, #a0aec0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
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
        }

        .form-control {
          background-color: rgba(26, 32, 44, 0.6) !important;
          border: 2px solid #4a5568 !important;
          color: #ffffff !important;
          border-radius: 10px !important;
          padding: 14px 18px;
          transition: all 0.3s ease;
          box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .form-control:focus {
          background-color: rgba(45, 55, 72, 0.7) !important;
          border-color: #718096 !important;
          box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.3) !important;
          color: #ffffff !important;
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

        <div className="card shadow-lg p-4 auth-card" style={{ margin: '0 auto' }}>
          <h3 className="text-center mb-3 fw-bold">Create Account <span>✨</span></h3>

          <div onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                required
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button onClick={handleSubmit} className="btn btn-success w-100 mt-2 auth-btn">
              Register
            </button>
          </div>

          <p className="text-center mt-3">
            Already have an account? <a href="/login">Login</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;