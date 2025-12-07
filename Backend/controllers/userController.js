const UserCodeverse = require("../models/User");
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


// exports.sendFriendRequest = async (req, res) => {
//   const { UserID, receiverID } = req.body;

//   try {
//     if (!UserID || !receiverID) {
//       return res.status(400).json({
//         success: false,
//         message: "UserID and receiverID are required",
//       });
//     }

//     if (UserID === receiverID) {
//       return res.status(400).json({
//         success: false,
//         message: "You cannot send a friend request to yourself",
//       });
//     }

//     const receiver = await UserCodeverse.findById(receiverID);
//     const sender = await UserCodeverse.findById(UserID);

//     if (!receiver || !sender) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     // Check if already friends
//     if (receiver.friends.includes(UserID)) {
//       return res.status(400).json({
//         success: false,
//         message: "Already friends",
//       });
//     }

//     // Check if request already sent
//     if (receiver.friendRequests.includes(UserID)) {
//       return res.status(400).json({
//         success: false,
//         message: "Friend request already sent",
//       });
//     }

//     // Add the request
//     receiver.friendRequests.push(UserID);
//     await receiver.save();

//     return res.status(200).json({
//       success: true,
//       message: "Friend request sent successfully",
//     });

//   } catch (err) {
//     console.log("Error :", err);
//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong",
//     });
//   }
// };

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
    const verificationCode = "LC-" + Math.random().toString(36).substring(2, 10);

    user.leetcodeVerificationCode = verificationCode;
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
  const {userId,username} = req.body;

  const summary = await fetchLeetCodeSummary(username);

  if (!summary) {
    return res.status(400).json({ msg: "LeetCode Summary not found" });
  }

  if (!summary.includes(UserCodeverse.leetcodeVerificationCode)) {
    return res.status(400).json({ msg: "Code not found in summary" });
  }

  res.json({ msg: "Verified!" });

  
};
