import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import ChallengePage from "./components/Challenge";
import JoinRoom from "./components/JoinRoom"
import CreateRoom from "./components/CreateRoom";
import Room from "./components/Room";


function App() {
  return (
    
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/challenge" element={<ChallengePage />} />
        <Route path="/join-room" element={<JoinRoom/>}/>
        <Route path="/create-room" element={<CreateRoom/>} />
        <Route path="/room:roomid" element={<Room/>}/>
      </Routes>

    </BrowserRouter>
  );
}

export default App;
