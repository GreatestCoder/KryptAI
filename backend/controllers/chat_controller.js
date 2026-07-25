const Conversation = require("../models/Conversation.js");
const Message = require("../models/Message.js");
const graph = require("../agents/graph/supervisor_graph");


module.exports.chat = async (req, res) => {
    try {
        const { prompt, conversationId, agent } = req.body;
        const file = req.file;
        const conversation = await Conversation.findOne({ _id: conversationId, userId: req.user._id });
        if (!conversation) {
            return res.status(404).json({ success: false, message: "Conversation not found" });
        }

        const memory = await Message.find({ conversationId }).sort({ createdAt: -1 }).limit(20).select("role content -_id");
        const images = [];
        if (file) {
            images.push(`${req.protocol}://${req.get("host")}/uploads/${file.filename}`);
        }

        await Message.create({ conversationId, role: "user", content: prompt, images });
        const result = await graph.invoke({ prompt, conversationId, memory: memory.reverse(), agent, file });
        await Message.create({ conversationId, role: "assistant", content: result.aiResponse, images: result.images || [], artifacts: result.artifacts || [] });

        conversation.updatedAt = new Date();
        await conversation.save();
        return res.status(200).json({ success: true, response: result.aiResponse, images: result.images || [], artifacts: result.artifacts || [] });

    } catch (error) {
        console.error("Chat controller error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};


module.exports.createConversation = async (req, res) => {
    try {
        const conversation = await Conversation.create({ userId: req.user._id });
        return res.status(201).json({ success: true, conversation });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


module.exports.getConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find({ userId: req.user._id }).sort({ updatedAt: -1 });
        return res.status(200).json({ success: true, conversations });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


module.exports.saveMessage = async (req, res) => {
    try {
        const { conversationId, role, content, images, artifacts } = req.body;
        const conversation = await Conversation.findOne({ _id: conversationId, userId: req.user._id });
        if (!conversation) {
            return res.status(404).json({ success: false, message: "Conversation not found" });
        }

        const message = await Message.create({ conversationId, role, content, images: images || [], artifacts: artifacts || [] });
        return res.status(201).json({ success: true, message });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


module.exports.getMessages = async (req, res) => {
    try {
        const { id: conversationId } = req.params;
        const conversation = await Conversation.findOne({ _id: conversationId, userId: req.user._id });
        if (!conversation) {
            return res.status(404).json({ success: false, message: "Conversation not found" });
        }

        const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
        return res.status(200).json({ success: true, messages });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


module.exports.updateConversation = async (req, res) => {
    try {
        const { conversationId, title } = req.body;
        const conversation = await Conversation.findOneAndUpdate({ _id: conversationId, userId: req.user._id }, { title }, { new: true });
        if (!conversation) {
            return res.status(404).json({ success: false, message: "Conversation not found" });
        }

        return res.status(200).json({ success: true, conversation });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


module.exports.deleteConversation = async (req, res) => {
    try {
        const { id: conversationId } = req.params;
        const conversation = await Conversation.findOne({ _id: conversationId, userId: req.user._id });
        if (!conversation) {
            return res.status(404).json({ success: false, message: "Conversation not found" });
        }

        await Message.deleteMany({ conversationId });
        await Conversation.findByIdAndDelete(conversationId);
        return res.status(200).json({ success: true, message: "Conversation deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};