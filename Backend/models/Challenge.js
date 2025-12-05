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
    ref: "User",
    required: true
  },

  participants: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      status: {
        type: String,
        enum: ["pending", "accepted", "completed"],
        default: "pending"
      },
      score: Number
    }
  ],

  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "easy"
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
    enum: ["upcoming", "active", "completed"],
    default: "upcoming"
  }
});

module.exports = mongoose.model("Challenge", ChallengeSchema);
