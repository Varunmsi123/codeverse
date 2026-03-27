const express = require("express");
const router = express.Router();

const { createRoom, joinRoom, run, getRoom ,getMyRooms} = require("../controllers/createRoomController");
const { auth } = require("../middleware/auth");

router.post("/create", auth, createRoom);
router.post("/join", auth, joinRoom);
router.post("/run", auth, run);
router.get("/my-rooms", auth, getMyRooms);
router.get("/:roomId", auth, getRoom);


module.exports = router;