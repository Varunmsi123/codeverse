import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";

let debounceTimer;

const Room = () => {
  const { roomid } = useParams();
  const [language, setLanguage] = useState("");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  // Fetch room details on mount
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await fetch(`http://localhost:5000/room/${roomid}`);
        const data = await res.json();

        setLanguage(data.language);
        setCode(data.code || getDefaultCode(data.language));
      } catch (err) {
        console.error("Error fetching room data", err);
      }
    };

    fetchRoom();
  }, [roomid]);

  useEffect(() => {
    if (!code) return;

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      try {
        await fetch(`http://localhost:5000/room/${roomid}/code`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        });
      } catch (err) {
        console.error("Error saving code:", err);
      }
    }, 1000);

    return () => clearTimeout(debounceTimer);
  }, [code, roomid]);

  const getDefaultCode = (lang) => {
    switch (lang) {
      case "python":
        return 'print("Hello, World!")';
      case "java":
        return `public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}`;
      case "c":
        return `#include <stdio.h>\nint main() {\n  printf("Hello, World!");\n  return 0;\n}`;
      case "cpp":
        return `#include <iostream>\nint main() {\n  std::cout << "Hello, World!";\n  return 0;\n}`;
      default:
        return "// Start coding...";
    }
  };

  const handleRun = async () => {
    try {
      const res = await fetch("http://localhost:5000/room/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, language }),
      });

      const data = await res.json();
      setOutput(data.output);
    } catch (err) {
      setOutput("Error running code.");
    }
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container py-4">
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-1">Room ID: {roomid}</h4>
              <p className="mb-0">
                Language: <span className="badge bg-primary">{language}</span>
              </p>
            </div>
            <button 
              className="btn btn-outline-secondary btn-sm" 
              onClick={copyRoomId}
            >
              {copied ? "Copied!" : "Copy Room ID"}
            </button>
          </div>
        </div>
      </div>

      <div className="card shadow-sm mb-3">
        <div className="card-body p-0">
          <Editor
            height="400px"
            language={language}
            value={code}
            onChange={(value) => setCode(value)}
            theme="vs-dark"
          />
        </div>
      </div>

      <button 
        className="btn btn-success btn-lg mb-3" 
        onClick={handleRun}
      >
        Run Code
      </button>

      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white">
          <h5 className="mb-0">Output</h5>
        </div>
        <div className="card-body bg-dark text-white">
          <pre className="mb-0" style={{ fontFamily: "monospace" }}>
            {output || "Run your code to see output..."}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default Room;