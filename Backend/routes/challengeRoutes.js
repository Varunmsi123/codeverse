const express = require("express");
const router = express.Router();

const {getFreinds, getProblems, sendChallenge, respondChallenge} = require("../controllers/challengeController");
const { auth } = require("../middleware/auth");


console.log("Ye Agya");
router.get("/friends",auth,getFreinds);
router.get("/problems",auth,getProblems);
router.post("/send",auth,sendChallenge);
router.post("/respond",auth,respondChallenge);

module.exports = router;