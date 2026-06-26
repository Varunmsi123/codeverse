const Room = require("../models/Room");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");

exports.createRoom = async (req, res) => {
  const owner = req.user;
  const { roomName, language, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const roomId = uuidv4();

    const newRoom = new Room({
      roomId,
      roomName,
      password: hashedPassword,
      displayPassword: password,
      language,
      owner,
      members: [owner],
    });

    await newRoom.save();

    return res.status(201).json({
      success: true,
      msg: "Room created successfully",
      roomId,
    });
  } catch (err) {
    console.log("Create Room error:", err);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.joinRoom = async (req, res) => {
  const userId = req.user;
  const { roomId, password } = req.body;

  try {
    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({ success: false, msg: "Room not found" });
    }

    const isMatch = await bcrypt.compare(password, room.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, msg: "Incorrect password" });
    }

    if (!room.members.includes(userId)) {
      room.members.push(userId);
      await room.save();
    }

    return res.status(200).json({
      success: true,
      msg: "Joined room successfully",
      roomId: room.roomId,
      language: room.language,
    });
  } catch (err) {
    console.log("Join Room error:", err);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

function getGlotLanguage(language) {
  const map = {
    javascript: { lang: 'javascript', filename: 'main.js' },
    python:     { lang: 'python',     filename: 'main.py' },
    java:       { lang: 'java',       filename: 'Main.java' },
    cpp:        { lang: 'cpp',        filename: 'main.cpp' },
    c:          { lang: 'c',          filename: 'main.c' },
  };
  return map[language] || map['javascript'];
}

exports.run = async (req, res) => {
  const { code, language } = req.body;

  if (!code || !language) {
    return res.status(400).json({ success: false, output: "Code and language required" });
  }

  try {
    const getPistonLanguage = (lang) => {
      const map = {
        javascript: { language: 'javascript', version: '*', filename: 'main.js' },
        python:     { language: 'python',     version: '*', filename: 'main.py' },
        java:       { language: 'java',       version: '*', filename: 'Main.java' },
        cpp:        { language: 'cpp',        version: '*', filename: 'main.cpp' },
        c:          { language: 'c',          version: '*', filename: 'main.c' },
      };
      return map[lang] || map['javascript'];
    };

    const { language: pistonLang, version: pistonVer, filename } = getPistonLanguage(language);

    console.log(`Executing code via Piston for: ${pistonLang}`);
    const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
      language: pistonLang,
      version: pistonVer,
      files: [
        {
          name: filename,
          content: code
        }
      ]
    });

    const runResult = response.data.run;
    const output = runResult.output || runResult.stdout || runResult.stderr || 'No output';
    return res.status(200).json({ success: true, output });

  } catch (err) {
    console.error("Piston execution error:", err.response?.data || err.message);
    return res.status(500).json({ success: false, output: "Code execution failed. Verify connection to the execution engine." });
  }
};

exports.getRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({ success: false, msg: "Room not found" });
    }

    return res.status(200).json({ success: true, room });
  } catch (err) {
    console.log("Get room error:", err);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.getMyRooms = async (req, res) => {
  try {
    const userId = req.user;

    const rooms = await Room.find({
      members: { $in: [userId] }
    })
      .select('-password') 
      .sort({ createdAt: -1 }); 

    return res.status(200).json({
      success: true,
      rooms,
    });

  } catch (err) {
    console.log("Get My Rooms error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

exports.updateCode = async (req, res) => {
  try {
    console.log("UPDATE CODE HIT");

    const { roomId } = req.params;
    const { code } = req.body;

    console.log("roomId:", roomId);
    console.log("code:", code);

    const room = await Room.findOneAndUpdate(
      { roomId },
      { code },
      { new: true }
    );

    console.log("Updated Room:", room);

    res.status(200).json({
      success: true,
      message: "Code saved successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to save code",
    });
  }
};
