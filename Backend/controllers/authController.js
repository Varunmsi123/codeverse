const UserCodeverse = require("../models/User");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generatetokens");

exports.register = async (req, res) => {
  const { email, username, password } = req.body;

  console.log(email);

  try {
    const existingUser = await UserCodeverse.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserCodeverse.create({
      email,
      username,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


exports.login = async (req, res) => {
const { email, password } = req.body;
 console.log(email);
 console.log('Secret Key Used in Login:',process.env.JWT_SECRET)
 console.log(UserCodeverse.collection.name)
  try {
   
    const existingUser = await UserCodeverse.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

     
    
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }

    console.log("User is",existingUser)

    const token = generateToken(existingUser._id);

   
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
      },
    });

  } catch (err) {
    console.log("Login Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


exports.getProfile = async (req, res) => {
  try {
    const user = await UserCodeverse.findById(req.user).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("Profile Fetch Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
