const express = require("express");
const router = express.Router();

const { searchByUsername } = require("../controllers/userController");
const { auth } = require("../middleware/auth");

console.log('Yha aa gya hu');
router.get("/search", auth, searchByUsername);

module.exports = router;
