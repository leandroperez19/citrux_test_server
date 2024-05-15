import * as jwt from 'jsonwebtoken';
import { Request, Response } from "express";
import { User } from "../models/user.model";
import { OTP } from "../models/recover.model";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt";
import * as otpGenerator from "otp-generator";
import { sendMail } from "../libs/nodemailer";
import { OTPTemplate } from "../email-templates/OTP";
import { TOKEN_SECRET } from '../config';
import { unauthorizedError } from '../static/responses';

export const register = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const userFound = await User.findOne({ email });
        if (userFound)
            return res
                .status(400)
                .json({ code: "error", message: "User is already registered" });

        const newUser = req.body;
        const hashedPassword = await bcrypt.hash(newUser.password, 10);
        newUser.password = hashedPassword;
        const user = new User(newUser);
        const savedUser = await user.save();
        const token = await createAccessToken({ id: savedUser._id });

        
        const today = new Date();
        const oneDay = 24 * 60 * 60 * 1000;
        const expirationDate = new Date(today.getTime() + oneDay);

        res.cookie("token", token, {
            expires: expirationDate,
            sameSite: "none",
            httpOnly: false,
            secure: true
        });

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: savedUser._id,
                userName: savedUser.userName,
                email: savedUser.email,
                createdAt: savedUser.createdAt,
                updatedAt: savedUser.updatedAt,
            },
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            code: "error",
            message: "Internal server error",
        });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const userFound = await User.findOne({ email });
        if (!userFound)
            return res
                .status(400)
                .json({ code: "error", message: "User not found" });

        const isMatch = await bcrypt.compare(password, userFound.password);
        if (!isMatch)
            return res
                .status(400)
                .json({ code: "error", message: "Invalid credentials" });

        const token = await createAccessToken({ id: userFound._id });

        const today = new Date();
        const oneDay = 24 * 60 * 60 * 1000;
        const expirationDate = new Date(today.getTime() + oneDay);

        res.cookie("token", token, {
            expires: expirationDate,
            sameSite: "none",
            httpOnly: false,
            secure: true
        });

        res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: userFound._id,
                userName: userFound.userName,
                email: userFound.email,
                createdAt: userFound.createdAt,
                updatedAt: userFound.updatedAt,
            },
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            code: "error",
            message: "Internal server error",
        });
    }
};

export const logout = (req: Request, res: Response) => {
    res.cookie("token", "", {
        expires: new Date(0),
        sameSite: "none",
        httpOnly: false,
        secure: true
    });
    return res
        .status(200)
        .json({ code: "success", message: "User logged out successfully" });
};

export const profile = async (req: Request, res: Response) => {
    const userFound = await User.findById(req.body.userId);
    if (!userFound)
        return res
            .status(404)
            .json({ code: "error", message: "User not found" });
    return res.status(200).json({
        code: 'success',
        user: {
            id: userFound._id,
            userName: userFound.userName,
            email: userFound.email,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt,
        }
    });
};

export const requestOTP = async (req: Request, res: Response) => {
    try {
        const { email, userName } = req.body;
        const newOTP = otpGenerator.generate(6, {
            upperCaseAlphabets: true,
            specialChars: false,
            lowerCaseAlphabets: false,
        });
        const hashedOTP = await bcrypt.hash(newOTP, 10);
        const record = new OTP({ otp: hashedOTP, userEmail: email });

        try {
            await sendMail(
                email,
                "Password Recover",
                newOTP,
                OTPTemplate(newOTP, userName)
            );
            await record.save();
        } catch (e) {
            res.status(500).json({
                code: "error",
                message: "Internal server error",
            });
        }

        setTimeout(async () => {
            await OTP.deleteOne({ userEmail: email });
        }, 300000);

        return res
            .status(200)
            .json({
                code: "success",
                message: "OTP created and sent successfully",
            });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            code: "error",
            message: "Internal server error",
        });
    }
};

export const updatePassword = async (req: Request, res: Response) => {
    try {
        const { email, newPassword } = req.body;
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updatedUser = await User.findOneAndUpdate(
            { email },
            { $set: { password: hashedPassword } },
            { new: true }
        );

        if (!updatedUser)
            return res
                .status(400)
                .json({ code: "error", message: "User not found" });

        await OTP.findOneAndDelete({ userEmail: email })

        res.status(200).json({
            code: "success",
            message: "Password updated successfully"
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            code: "error",
            message: "Internal server error",
        });
    }
};

export const verifyToken = async (req: Request, res: Response) => {
    const { token } = req.cookies;

    if(!token) return unauthorizedError(res)

    jwt.verify(token, TOKEN_SECRET, async (err: any, user: any) => {
        if(err) return unauthorizedError(res);

        const userFound = await User.findById(user?.id);
        if(!userFound) return unauthorizedError(res);

        res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: userFound._id,
                userName: userFound.userName,
                email: userFound.email,
                createdAt: userFound.createdAt,
                updatedAt: userFound.updatedAt,
            },
        });
    })
}