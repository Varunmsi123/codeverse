const UserCodeverse = require("../models/User");
const friendRequests = require("../models/Freindrequest");
const Notification = require("../models/Notifications");

exports.respondFriendRequest = async (req, res) => {
  try {
    const { notificationId, senderId, action } = req.body;
    const receiverId = req.user;
    console.log(notificationId);
    console.log(senderId);
    console.log(action);
    console.log(receiverId);
    // 1️⃣ Validation
    if (!notificationId || !senderId || !action) {
      return res.json({
        success: false,
        message: "notificationId, senderId and action are required",
      });
    }

    if (!["accept", "reject"].includes(action)) {
      return res.json({
        success: false,
        message: "Invalid action",
      });
    }

    if (senderId === receiverId) {
      return res.json({
        success: false,
        message: "Invalid friend request",
      });
    }

    // 2️⃣ Find friend request
    const friendRequest = await friendRequests.findOne({
      sender:senderId,
      receiver:receiverId,
    });

    if (!friendRequest) {
      return res.json({
        success: false,
        message: "Friend request not found",
      });
    }

    // 3️⃣ ACCEPT
    if (action === "accept") {
      friendRequest.status = "accepted";
      await friendRequest.save();

      // Add friends (both sides)
      await UserCodeverse.findByIdAndUpdate(senderId, {
        $addToSet: { friends: receiverId },
      });

      await UserCodeverse.findByIdAndUpdate(receiverId, {
        $addToSet: { friends: senderId },
      });

      const x = UserCodeverse.findById(senderId);
      // Notify sender
      await Notification.create({
        userId: senderId,
        senderId: receiverId,
        type: "friend-accepted",
        message: `${x} accepted your friend request`,
      });
    }

    // 4️⃣ REJECT
    if (action === "reject") {
      friendRequest.status = "rejected";
      await friendRequest.save();
    }

    
    await Notification.findByIdAndUpdate(notificationId, {
      isRead: true,
    });

    return res.json({
      success: true,
      message:
        action === "accept"
          ? "Friend request accepted"
          : "Friend request rejected",
    });
  } catch (error) {
    console.error("Friend request response error:", error);
    return res.json({
      success: false,
      message: "Server error",
    });
  }
};
