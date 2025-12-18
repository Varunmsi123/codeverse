const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserCodeverse",
      required: true,
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserCodeverse",
      required: true,
    },

    type: {
      type: String,
      enum: ["friend-request", "added-to-room", "challenge", "friend-accepted"],
      required: true,
    },

    roomId: {
      type: String, // only for "added-to-room"
    },

    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Challenge"
    },

    message: {
      type: String,
      required: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
