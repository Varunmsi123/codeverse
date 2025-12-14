const UserCodeverse = require("../models/User");
const friendRequests = require("../models/Freindrequest");
const Notification = require("../models/Notifications");


exports.getFreinds = async(req,res) =>{
    const userId = req.user;

    try{
        const user = await UserCodeverse.findById(userId)
        .select("-password")
        .populate("friends", "name username email");

        if(!user){
            return res.status(404).json({
               success: false,
               message:"User not Found",
            });
        }

        return res.status(200).json({
          success:true,
          friends:user.friends,
        });
    }catch(err){
        console.log("Error friends Fetch",err);
        return res.status(500).json({
            success:false,
            message:"Server Error",
        });
    }
};

exports.getProblems = async (req, res) => {
  try {
    const response = await fetch("https://leetcode-api-pied.vercel.app/problems");
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch problems" });
  }
};
