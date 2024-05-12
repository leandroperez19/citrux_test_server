import mongoose from "mongoose";

const otpModel = new mongoose.Schema(
    {
        otp: {
            type: String,
            required: true,
            trim: true
        },
        userEmail: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

export const OTP = mongoose.model('Recover', otpModel)