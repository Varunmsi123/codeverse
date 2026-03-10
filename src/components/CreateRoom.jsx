import { useState } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const CreateRoom = () => {
  const [password, setPassword] = useState('');
  const [language, setLanguage] = useState('java');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!password || !language) {
    alert("Please enter both language and password.");
    return;
  }

  setLoading(true);

  try {
    const token = localStorage.getItem("token"); // JWT

    const res = await fetch("http://localhost:5000/room/createroom", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // 🔑 IMPORTANT
      },
      body: JSON.stringify({
        password,
        language,
      }),
    });

    if (!res.success) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to create room");
    }

    const data = await res.json();

    alert("Room created! Redirecting...");

    navigate(`/room/${data.roomId}?lang=${language}`);

  } catch (err) {
    console.error("Create room error:", err.message);
    alert(err.message || "Something went wrong. Try again.");
    setLoading(false);
  }
};


  return (
    <div className="container">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="card-title text-center mb-4">Create a Room</h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Room Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter room password"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Select Language</label>
                  <select
                    className="form-select"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    required
                    disabled={loading}
                  >
                    <option value="">-- Select Language --</option>
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="c">C</option>
                  </select>
                </div>

                <button className="btn btn-primary w-100" disabled={loading}>
                  {loading ? "Creating Room..." : "Create Room"}
                </button>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
