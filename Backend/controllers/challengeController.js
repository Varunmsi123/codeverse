const UserCodeverse = require("../models/User");
const friendRequests = require("../models/Freindrequest");
const Notification = require("../models/Notifications");
const Challenge = require("../models/Challenge");



exports.getFreinds = async(req,res) =>{
    const userId = req.user;

    try{
        const user = await UserCodeverse.findById(userId)
        .select("-password")
        .populate("friends", "name username email");

        if(!user){
            return res.status(404).json({
               success: false,
               message:"User not Found",
            });
        }

        return res.status(200).json({
          success:true,
          friends:user.friends,
        });
    }catch(err){
        console.log("Error friends Fetch",err);
        return res.status(500).json({
            success:false,
            message:"Server Error",
        });
    }
};

exports.getProblems = async (req, res) => {
  try {
    const response = await fetch("https://leetcode-api-pied.vercel.app/problems");
    const data = await response.json();
    res.json(
      {
        success:true,
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

    const x = await UserCodeverse.findById(senderId).select("username");
    await Notification.create({
      senderId: senderId,
      userId: friendId,
      type: "challenge",
      message: `You have received a new coding challenge from ${x.username}`,
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
    res.status(500).json({
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

    // 1️⃣ Notification
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    }

    // 2️⃣ Challenge
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found"
      });
    }

    // 3️⃣ Participant
    const participant = challenge.participants.find(
      (p) => p.userId.toString() === userId.toString()
    );

    if (!participant) {
      return res.status(403).json({
        success: false,
        message: "You are not part of this challenge"
      });
    }

    // 4️⃣ Update participant + challenge
    const newStatus = action === "accept" ? "accepted" : "cancelled";

    participant.status = newStatus;

    if (action === "accept") {
      challenge.status = "active"; // valid enum
    }

    await challenge.save();

    // 5️⃣ Update UserCodeverse (receiver)
    await UserCodeverse.updateOne(
      { _id: userId, "challengesReceived.challengeId": challengeId },
      {
        $set: {
          "challengesReceived.$.status": newStatus
        }
      }
    );

    
    await UserCodeverse.updateOne(
      { _id: notification.senderId, "challengesSent.challengeId": challengeId },
      {
        $set: {
          "challengesSent.$.status": newStatus
        }
      }
    );

    // 7️⃣ Delete notification
    await Notification.findByIdAndDelete(notificationId);

    return res.status(200).json({
      success: true,
      message: `Challenge ${action}ed successfully`
    });

  } catch (err) {
    console.log("Error in respondChallenge Controller:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};



