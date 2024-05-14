import mongoose from "mongoose";

const summaryModel = new mongoose.Schema(
    {
        url: {
            type: String,
            required: String
        },
        content: {
            type: String,
            required: String
        },
        userId: {
            type: String,
            required: String
        }
    },
    {
        timestamps: true
    }
)

export const Summary = mongoose.model('summary', summaryModel)