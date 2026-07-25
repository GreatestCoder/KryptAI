const express = require("express");
const router = express.Router();
const {login, logout, getCurrentUser} = require("../controllers/auth_controller");
const {protectRoute} = require("../lib/utils");


router.post("/login", login);
router.post("/logout", protectRoute, logout);
router.get("/me", protectRoute, getCurrentUser);


module.exports = router;