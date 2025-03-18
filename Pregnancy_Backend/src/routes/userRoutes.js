const express = require("express");
const router = express.Router();
const { sql, poolPromise } = require('../config/db');
const verifyToken = require("../middleware/authMiddleware");
const { registerUser, loginUser, getAllUsers, getUserInfo, updateUser, deleteUser } = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get('/getallusers', getAllUsers);
router.get("/userinfo", verifyToken, getUserInfo);
router.put("/update", verifyToken, updateUser);
router.delete("/delete", verifyToken, deleteUser);

module.exports = router;
