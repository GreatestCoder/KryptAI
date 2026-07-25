const express = require("express");
const router = express.Router();
const { createConversation, getConversations, updateConversation, saveMessage, getMessages, chat, deleteConversation } = require("../controllers/chat_controller");
const {protectRoute, upload} = require("../lib/utils");

router.use(protectRoute);
router.post("/chat", upload.single("file"), chat);
router.post("/create-conversation", createConversation);
router.get("/get-conversations", getConversations);
router.post("/update-conversation", updateConversation);
router.post("/save-message", saveMessage);
router.get("/get-messages/:id", getMessages);
router.delete("/delete-conversation/:id", deleteConversation);


module.exports = router;