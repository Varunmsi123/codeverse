const UserCodeverse = require("../models/User");
const friendRequests = require("../models/Freindrequest");
const Notification = require("../models/Notifications");
const Challenge = require("../models/Challenge");



exports.getFreinds = async (req, res) => {
  const userId = req.user;

  try {
    const user = await UserCodeverse.findById(userId)
      .select("-password")
      .populate("friends", "name username email");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not Found",
      });
    }

    return res.status(200).json({
      success: true,
      friends: user.friends,
    });
  } catch (err) {
    console.log("Error friends Fetch", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.getProblems = async (req, res) => {
  try {
    const response = await fetch("https://leetcode-api-pied.vercel.app/problems");
    const data = await response.json();
    res.json(
      {
        success: true,
        data,
      }
    );
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch problems" });
  }
};

exports.sendChallenge = async (req, res) => {
  try {
    const senderId = req.user;
    const { friendId, problemId, title, difficulty } = req.body;

    if (!friendId || !problemId) {
      return res.status(400).json({
        success: false,
        message: "friendId and problemId are required"
      });
    }

    // 1️⃣ Create challenge
    const challenge = await Challenge.create({
      title: title || "Coding Challenge",
      description: `Solve problem ID ${problemId}`,
      createdBy: senderId,
      difficulty: difficulty || "Easy",
      participants: [
        { userId: senderId, status: "accepted" },
        { userId: friendId, status: "pending" }
      ],
      startTime: new Date(),
      status: "upcoming"
    });

   
    await UserCodeverse.findByIdAndUpdate(
      senderId,
      { $addToSet: { challengesSent: challenge._id } }
    );

    
    await UserCodeverse.findByIdAndUpdate(
      friendId,
      { $addToSet: { challengesReceived: challenge._id } }
    );

    
    const sender = await UserCodeverse.findById(senderId).select("username");

    await Notification.create({
      senderId,
      userId: friendId,
      type: "challenge",
      message: `You have received a new coding challenge from ${sender.username}`,
      challengeId: challenge._id,
      isRead: false
    });

    return res.status(201).json({
      success: true,
      message: "Challenge sent successfully",
      challenge
    });

  } catch (err) {
    console.error("Send challenge error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error"
    });
  }
};


exports.respondChallenge = async (req, res) => {
  try {
    const userId = req.user;
    const { notificationId, challengeId, action } = req.body;

    if (!notificationId || !challengeId || !action) {
      return res.status(400).json({
        success: false,
        message: "notificationId, challengeId and action are required"
      });
    }

    if (!["accept", "reject"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Invalid action"
      });
    }

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    }

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found"
      });
    }

    const participant = challenge.participants.find(
      (p) => p.userId.toString() === userId.toString()
    );

    if (!participant) {
      return res.status(403).json({
        success: false,
        message: "You are not part of this challenge"
      });
    }

    // Participant status
    participant.status = action === "accept" ? "accepted" : "cancelled";

    // Challenge status
    challenge.status = action === "accept" ? "active" : "rejected";

    await challenge.save();

    // Mark notification read
    await Notification.findByIdAndUpdate(notificationId, {
      $set: { isRead: true }
    });

    return res.status(200).json({
      success: true,
      message:
        action === "accept"
          ? "Challenge accepted successfully"
          : "Challenge rejected successfully"
    });

  } catch (err) {
    console.log("Error in respondChallenge Controller:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};


exports.getchallengeSent = async (req, res) => {
  try {
    const userId = req.user;
    const user = await UserCodeverse.findById(userId)
      .select("-password -leetcodeVerificationCode")
      .populate({
        path: "challengesSent",
        model: "Challenge",        // 👈 force model
        populate: [
          {
            path: "createdBy",
            model: "UserCodeverse",
            select: "username email avatar rating"
          },
          {
            path: "participants.userId",
            model: "UserCodeverse",
            select: "username email avatar rating isOnline"
          }
        ]
      });


    return res.json({
      success: true,
      challenges: user,
    });

  } catch (err) {
    console.log("Error in FetchSentChallengeController:", err);
    return res.json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.getchallengeReceived = async (req, res) => {
  try {
    const userId = req.user;
    const user = await UserCodeverse.findById(userId)
      .select("-password -leetcodeVerificationCode")
      .populate({
        path: "challengesReceived",
        model: "Challenge",        
        populate: [
          {
            path: "createdBy",
            model: "UserCodeverse",
            select: "username email avatar rating"
          },
          {
            path: "participants.userId",
            model: "UserCodeverse",
            select: "username email avatar rating isOnline"
          }
        ]
      });


    return res.json({
      success: true,
      challenges: user,
    });

  } catch (err) {
    console.log("Error in FetchReceivedChallengeController:", err);
    return res.json({
      success: false,
      message: "Internal Server Error",
    });
  }
};



exports.verifyChallenge=async(req,res)=>{
try {
    const userId = req.user;
    const userName = await UserCodeverse.findById(userId)
      .select("leetcodeUsername")

      console.log(userName)
       const response = await fetch(`https://leetcode-api-pied.vercel.app/user/${userName.leetcodeUsername}/submissions?limit=5`);
       const data = await response.json();


    return res.json({
      success: true,
     submissions:data
    });

  } catch (err) {
    console.log("Error in FetchReceivedChallengeController:", err);
    return res.json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

exports.updateStatus = async (req, res) => {
  try {
    const { challengeId } = req.params;

    const challenge = await Challenge.findByIdAndUpdate(
      challengeId,
      { status: "solved" },
      { new: true }
    );

    console.log("Hona to chahiye");

    if (!challenge) {
      return res.status(404).json({ success: false, message: "Challenge not found" });
    }

    return res.status(200).json({ success: true, challenge });

  } catch (error) {
    console.log("Update Status Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.getHomeChallenges = async (req, res) => {
  try {
    const userId = req.user;

    const user = await UserCodeverse.findById(userId)
      .select("challengesReceived")
      .populate({
        path: "challengesReceived",
        model: "Challenge",
        populate: {
          path: "participants.userId",
          model: "UserCodeverse",
          select: "username avatar",
        },
      });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Only return challenges where receiver (participants[1]) status is not cancelled
    const challenges = user.challengesReceived.map((challenge) => ({
      _id: challenge._id,
      title: challenge.title,
      difficulty: challenge.difficulty,
      status: challenge.status,
      createdAt: challenge.createdAt,
      sentBy: challenge.participants[0]?.userId?.username, // sender
    }));

    return res.status(200).json({
      success: true,
      challenges,
    });

  } catch (err) {
    console.log("Error in getHomeChallenges:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};










