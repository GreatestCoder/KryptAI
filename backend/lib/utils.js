const User = require("../models/User");
const multer = require("multer");
const path = require("path");


module.exports.protectRoute = async (req, res, next) => {
    try {
        const userId = req.cookies?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized - Please log in" });
        }

        const user = await User.findById(userId);
        if (!user) {
            res.clearCookie("userId", { httpOnly: true, secure: true, sameSite: "none" });
            return res.status(401).json({ success: false, message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Error in protectRoute middleware:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, path.join(__dirname, "../public/uploads"));
    },

    filename(req, file, cb) {
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
        cb(null, uniqueName);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error("Only PNG, JPG, JPEG, WEBP images and PDF files are allowed."));
    }
    cb(null, true);
};


module.exports.upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });