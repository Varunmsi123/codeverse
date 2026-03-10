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

    
    code: {
      type: String,
      default: "",
    },

  
    language: {
      type: String,
      default: "javascript",
    },

    lastEditedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

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


const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
