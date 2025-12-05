const mongoose = require("mongoose");


const leaderboardSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // each user appears once on leaderboard
    },

    // Total LeetCode problems solved (sync from their profile)
    totalProblemsSolved: {
      type: Number,
      default: 0,
    },

    // Platform-specific rating (challenges, battles)
    rating: {
      type: Number,
      default: 1000,
    },

    // Number of challenges the user won
    challengesWon: {
      type: Number,
      default: 0,
    },

    // Number of challenges the user lost
    challengesLost: {
      type: Number,
      default: 0,
    },

    // XP system (optional)
    xp: {
      type: Number,
      default: 0,
    },

    // Level system (optional)
    level: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Leaderboard", leaderboardSchema);
