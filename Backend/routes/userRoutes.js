const express = require("express");
const router = express.Router();

const { searchByUsername,  sendFriendRequest, getProfile, leetVerification, confirmVerification, getNotifications} = require("../controllers/userController");
const { auth } = require("../middleware/auth");

console.log('Yha aa gya hu');
router.get("/search", auth, searchByUsername);
router.post("/leetVerification",auth,leetVerification);
router.post("/verifyleet",auth,confirmVerification);
router.post("/request",auth,sendFriendRequest);
router.get("/notifications",auth,getNotifications);
router.get("/profile/:id",auth,getProfile);

module.exports = router;
