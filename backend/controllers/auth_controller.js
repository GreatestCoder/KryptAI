const { getAuth } = require("firebase-admin/auth");
const { app } = require("../lib/firebase");
const User = require("../models/User");
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");


module.exports.login = async (req, res) => {
    try {
        const { token } = req.body;
        const decoded = await getAuth(app).verifyIdToken(token);
        console.log(decoded);

        let user = await User.findOne({ firebaseUid: decoded.uid });
        if (!user) {
            user = await User.create({
                firebaseUid: decoded.uid,
                email: decoded.email,
                name: decoded.name,
                avatar: decoded.picture,
                provider: decoded.firebase?.sign_in_provider,
            });
        }

        res.cookie("userId", user._id.toString(), { httpOnly: true, secure: true, sameSite: "none", maxAge: 1000 * 60 * 60 * 24 * 7 });
        return res.json({ success: true, user });
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
};


module.exports.logout = async (req, res) => {
    try {
        res.clearCookie("userId", { httpOnly: true, secure: true, sameSite: "none" });
        return res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


module.exports.getCurrentUser = async (req, res) => {
    return res.json({ success: true, user: req.user });
};
