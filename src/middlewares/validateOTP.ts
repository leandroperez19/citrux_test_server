import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.model";
import { OTP } from "../models/recover.model";

export const OTPCheck = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const userFound = await User.findOne({ email });
    if(!userFound) return res.status(400).json({ code: "error", message: "User not found" });
    
    const optStored = await OTP.findOne({ userEmail: email })
    if(optStored) return res.status(200).json({ code: "success", message: "User has an OTP active, please check your email or wait 5 minutes to request a new one"})

    req.body = userFound;
    next()
}

export const validateOTP = async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp } = req.body;
    const otpFound = await OTP.findOne({ userEmail: email });
    if(!otpFound) return res.status(400).json({ code: "error", message: "OTP expired" });

    const isMatch = await bcrypt.compare(otp, otpFound.otp)
    if(!isMatch) return res.status(400).json({ code: "error", message: "Invalid otp" })

    next()
}