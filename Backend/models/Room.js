const mongoose = require("mongoose");


const roomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
    },

    roomName: {
      type: String,
      default: "Untitled Room",
    },

    // Owner of the room
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // All participants
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Collaborative Code
    code: {
      type: String,
      default: "",
    },

    // Programming language
    language: {
      type: String,
      default: "javascript",
    },

    // If this room is created for a challenge
    leetcodeQuestionSlug: {
      type: String,
      default: null,
    },

    // Track last person who edited the code
    lastEditedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Active Socket.io clients
    activeSockets: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        socketId: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Room", roomSchema);
