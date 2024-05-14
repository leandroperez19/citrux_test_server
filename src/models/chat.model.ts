import mongoose from "mongoose";

const messageModel = new mongoose.Schema(
    {
        summaryId: {
            type: String,
            required: true
        },
        userId: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        from: {
            type: String,
            enum: ["user", "AI"],
            required: true,
        }
    }
)

export const Message = mongoose.model('Message', messageModel)