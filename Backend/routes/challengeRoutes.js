const express = require("express");
const router = express.Router();

const {getFreinds, getProblems, sendChallenge, respondChallenge,getHomeChallenges, getchallengeSent,getchallengeReceived, verifyChallenge, updateStatus} = require("../controllers/challengeController");
const { auth } = require("../middleware/auth");


router.get("/friends",auth,getFreinds);
router.get("/problems",auth,getProblems);
router.post("/send",auth,sendChallenge);
router.post("/respond",auth,respondChallenge);
router.get("/sent",auth,getchallengeSent);
router.get("/received",auth,getchallengeReceived);
router.get("/submissions",auth,verifyChallenge);
router.get("/home-challenges", auth, getHomeChallenges);
router.patch('/updateStatus/:challengeId', auth, updateStatus);
module.exports = router;