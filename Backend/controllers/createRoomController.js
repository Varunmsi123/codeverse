const Room = require("../models/Room");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

exports.createroom = async (req, res) => {
    const owner = req.user;
    const { roomName, language, password } = req.body;

    try {
        const hashedpassword = await bcrypt.hash(password, 10);
        const roomId = uuidv4();

        const newRoom = new Room({
            roomId,
            password: hashedpassword,
            language,
            owner
        });

        await newRoom.save();

        return res.status(201).json({
            success: true,
            msg: "Room created successfully"
        });
    } catch (err) {
        console.log("Create Room error :", err);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
};

function getFileExtension(language) {
  const map = {
    python: "py",
    java: "java",
    c: "c",
    cpp: "cpp",
    javascript: "js",
  };
  return map[language] || "txt";
}

exports.run = async (req,res) =>{
 const { code, language } = req.body;

  if (!code || !language) {
    return res.status(400).json({ output: "Code and language required" });
  }

  try {
    const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
      language,
      version: "*",
      files: [
        {
          name: `Main.${getFileExtension(language)}`,
          content: code,
        },
      ],
    });

    res.status(200).json({ output: response.data.run.output });
  } catch (err) {
    console.error("Execution error:", err.response?.data || err.message || err);
    res.status(500).json({ output: "Execution failed" });
  }
}
