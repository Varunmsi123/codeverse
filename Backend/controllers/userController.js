const UserCodeverse = require("../models/User");
const friendRequests = require("../models/Freindrequest");
const Notification = require("../models/Notifications");
const { fetchLeetCodeSummary } = require("../utils/leetcode");

exports.searchByUsername = async (req, res) => {
  try {
    const query = req.query.username;
    console.log('Searching...');
    if (!query) {
      return res.json([]);
    }

    const users = await UserCodeverse.find({
      username: { $regex: query, $options: "i" }
    }).select("_id username");

    console.log(users);

    return res.json({ success: true, users });

  } catch (err) {
    console.error("Search Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await UserCodeverse.findById(userId)
      .select("-password");


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
      message: "Server error",
    });
  }
};


exports.sendFriendRequest = async (req, res) => {
  const { UserID, receiverID } = req.body;

  try {
    if (!UserID || !receiverID) {
      return res.status(400).json({
        success: false,
        message: "UserID and receiverID are required",
      });
    }

    if (UserID === receiverID) {
      return res.status(400).json({
        success: false,
        message: "You cannot send a friend request to yourself",
      });
    }

    const receiver = await UserCodeverse.findById(receiverID);
    const sender = await UserCodeverse.findById(UserID);

    if (!receiver || !sender) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 🔍 CHECK IF REQUEST ALREADY EXISTS
    const alreadySent = await friendRequests.findOne({
      sender: UserID,
      receiver: receiverID,
      status: "pending"
    });

    if (alreadySent) {
      return res.status(400).json({
        success: false,
        message: "Friend request already sent",
      });
    }

    // 🔍 CHECK IF THEY ARE ALREADY FRIENDS
    if (receiver.friends.includes(UserID)) {
      return res.status(400).json({
        success: false,
        message: "Already friends",
      });
    }

    // 📌 CREATE FRIEND REQUEST ENTRY
    const newRequest = await friendRequests.create({
      sender: UserID,
      receiver: receiverID,
    });

    // 📌 CREATE NOTIFICATION ENTRY
    await Notification.create({
      userId: receiverID,
      senderId: UserID,
      type: "friend-request",
      message: `${sender.username} sent you a friend request`,
      isRead: false,
    });

    return res.status(200).json({
      success: true,
      message: "Friend request sent successfully",
      request: newRequest,
    });

  } catch (err) {
    console.log("Error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};


exports.leetVerification = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await UserCodeverse.findById(userId);

    if (!user) {
      return res.json({
        success: false,
        message: "User not found"
      });
    }

    // If already verified — block generating new code
    if (user.leetcodeVerified === true) {
      return res.json({
        success: false,
        message: "You are already verified on LeetCode!"
      });
    }

    // If code already exists — do NOT generate again
    if (user.leetcodeVerificationCode) {
      return res.json({
        success: true,
        message: "Paste this existing code in your LeetCode bio",
        code: user.leetcodeVerificationCode
      });
    }

    // Generate new verification code ONLY ONCE
    const verificationCode = user.email.split("@")[0];

    user.leetcodeVerificationCode = verificationCode
    user.leetcodeVerified = false;

    await user.save();

    return res.json({
      success: true,
      message: "Paste this code in your LeetCode bio",
      code: verificationCode
    });

  } catch (err) {
    console.log("Error:", err);
    return res.json({
      success: false,
      message: "Internal server error"
    });
  }
};


exports.confirmVerification = async (req, res) => {
  try {
    const { userId, leetUsername: username } = req.body;

    if (!username) {
      return res.status(400).json({ msg: "Username is required" });
    }

    const user = await UserCodeverse.findById(userId);

    if (!user) {
      return res.json({
        success: false,
        message: "User not found"
      });
    }

    const response = await fetch(
      `https://leetcode-api-pied.vercel.app/user/${username}`
    );

    if (!response.ok) {
      return res.status(400).json({ msg: "Failed to fetch LeetCode data" });
    }

    const data = await response.json();

    const summary = data.profile?.aboutMe ?? "";

    if (!summary) {
      return res.status(400).json({ msg: "Summary not found on LeetCode profile" });
    }

    const emailPrefix = user.email.split("@")[0];
    const verificationCode = user.leetcodeVerificationCode;

    if (
      emailPrefix.toLowerCase() === summary.toLowerCase() &&
      summary.includes(verificationCode)
    ) {
      user.leetcodeVerified = true;

      // ✅ Set the verified LeetCode username
      user.leetcodeUsername = username;

      await user.save();

      return res.json({ msg: "Verified!" });
    }

    return res.status(400).json({
      msg: "Verification failed — code not found in LeetCode summary"
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
};



exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user;

    const notifications = await Notification.find({ userId, isRead: false })
      .populate("senderId", "username")
      .populate("challengeId", "title difficulty status")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      notifications,
    });
  } catch (err) {
    console.log("Error fetching notifications:", err);
    return res.status(500).json({
      success: false,
      message: "Error fetching notifications",
    });
  }
};





