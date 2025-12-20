const UserCodeverse = require("../models/User");
const friendRequests = require("../models/Freindrequest");
const Notification = require("../models/Notifications");

exports.respondFriendRequest = async (req, res) => {
  try {
    const { notificationId, senderId, action } = req.body;
    const receiverId = req.user;
  
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

    
    const friendRequest = await friendRequests.findOne({
      sender: senderId,
      receiver: receiverId,
    });

    if (!friendRequest) {
      return res.json({
        success: false,
        message: "Friend request not found",
      });
    }

    
    if (action === "accept") {
      friendRequest.status = "accepted";
      await friendRequest.save();

      
      await UserCodeverse.findByIdAndUpdate(senderId, {
        $addToSet: { friends: receiverId },
      });

      await UserCodeverse.findByIdAndUpdate(receiverId, {
        $addToSet: { friends: senderId },
      });

      const x = await UserCodeverse.findById(receiverId).select("username");
       console.log(x.username);
      await Notification.create({
        userId: senderId,          
        senderId: receiverId,     
        type: "friend-accepted",
        message: `${x.username} accepted your friend request`,
      });

    }

    
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
