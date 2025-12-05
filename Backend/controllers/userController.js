const UserCodeverse = require("../models/User");

exports.searchByUsername = async (req, res) => {
  try {
    const query = req.query.username;
    console.log('Searching...');
    if (!query) {
      return res.json([]);
    }

    const users = await UserCodeverse.find({
      username: { $regex: query, $options: "i" }  // partial + case insensitive
    }).select("_id username"); // send safe fields

    console.log(users);

    return res.json({ success: true, users });

  } catch (err) {
    console.error("Search Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.sendFreindRequest = async (req,res) =>{
  const {UserID,receiverID} = req.body;
  try{
    
  }catch(err){
    console.log("Error :",err);
  }
}
