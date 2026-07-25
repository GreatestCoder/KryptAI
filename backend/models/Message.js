const mongoose = require("mongoose");


const messageSchema = new mongoose.Schema(
    {
        conversationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
            required: true,
        },

        role: {
            type: String,
            enum: ["user", "assistant"],
            required: true,
        },

        content: {
            type: String,
            default: "",
        },

        images: {
            type: [String],
            default: [],
        },

        artifacts: [
            {
                type: {
                    type: String,
                    enum: ["project"],
                },

                title: String,

                files: [
                    {
                        name: String,
                        content: String,
                    },
                ],

                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);


const Message = mongoose.model("Message", messageSchema);
module.exports = Message;