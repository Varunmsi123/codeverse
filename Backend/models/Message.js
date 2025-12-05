const mongoose = require("mongoose");


const messageSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    // To support real-time chat with Socket.io
    socketId: {
      type: String,
      default: null,
    }
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

export default mongoose.model("Message", messageSchema);
