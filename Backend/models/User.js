const mongoose = require("mongoose");


const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    
    leetcodeUsername: {
      type: String,
      default: null
    },
    leetcodeVerified: {
      type: Boolean,
      default: false
    },
    leetcodeVerificationCode: {
      type: String,
      default: null
    },

   
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserCodeverse"
      }
    ],

    friendRequestsSent: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserCodeverse"
      }
    ],

    friendRequestsReceived: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserCodeverse"
      }
    ],

    
    challengesSent: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Challenge"
      }
    ],

    challengesReceived: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Challenge"
      }
    ],

    
    totalProblemsSolved: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 1000
    },

    
    isOnline: {
      type: Boolean,
      default: false
    },
    socketId: {
      type: String,
      default: null
    },

    
    avatar: {
      type: String,
      default: null
    },
    bio: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

const UserCodeverse = mongoose.model("UserCodeverse", userSchema);

module.exports = UserCodeverse;