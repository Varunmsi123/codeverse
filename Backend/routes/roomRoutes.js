const express = require("express");
const router = express.Router();

const { createroom, run } = require("../controllers/createRoomController");
const { auth } = require("../middleware/auth");


router.post("/createroom", auth,createroom);
router.post("/run",auth,run);

module.exports=router;
