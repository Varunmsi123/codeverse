const express = require("express");
const router = express.Router();

const {getFreinds, getProblems} = require("../controllers/challengeController");
const { auth } = require("../middleware/auth");


console.log("Ye Agya");
router.get("/friends",auth,getFreinds);
router.get("/problems",auth,getProblems);

module.exports = router;