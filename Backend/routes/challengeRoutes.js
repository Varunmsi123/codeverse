const express = require("express");
const router = express.Router();

const {getFreinds, getProblems, sendChallenge, respondChallenge, getchallengeSent,getchallengeReceived} = require("../controllers/challengeController");
const { auth } = require("../middleware/auth");


console.log("Ye Agya");
router.get("/friends",auth,getFreinds);
router.get("/problems",auth,getProblems);
router.post("/send",auth,sendChallenge);
router.post("/respond",auth,respondChallenge);
router.get("/sent",auth,getchallengeSent);
router.get("/received",auth,getchallengeReceived);
module.exports = router;