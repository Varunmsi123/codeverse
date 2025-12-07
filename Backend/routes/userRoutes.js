const express = require("express");
const router = express.Router();

const { searchByUsername,  sendFriendRequest, getProfile, leetVerification, confirmVerification} = require("../controllers/userController");
const { auth } = require("../middleware/auth");

console.log('Yha aa gya hu');
router.get("/search", auth, searchByUsername);
router.get("/:id",auth,getProfile);
router.post("/leetVerification",auth,leetVerification);
router.post("/verifyleet",auth,confirmVerification);

module.exports = router;
