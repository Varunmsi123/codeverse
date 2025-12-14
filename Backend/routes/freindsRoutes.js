const express = require("express");
const router = express.Router();

const { respondFriendRequest } = require("../controllers/freindsController");
const { auth } = require("../middleware/auth");

router.post("/respond", auth, respondFriendRequest);


module.exports = router;
