const mongoose = require("mongoose");

const ChallengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserCodeverse",
    required: true
  },

  participants: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserCodeverse"
      },
      status: {
        type: String,
        enum: ["pending", "accepted", "completed","cancelled"],
        default: "pending"
      },
      score: Number
    }
  ],

  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    default: "Easy"
  },

  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: String
    }
  ],

  startTime: Date,
  endTime: Date,

  status: {
    type: String,
    enum: ["upcoming", "active", "completed","rejected"],
    default: "upcoming"
  }
});

module.exports = mongoose.model("Challenge", ChallengeSchema);
