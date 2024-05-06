import { Request, Response } from "express";
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt";

export const register = async (req: Request, res: Response) => {
    try {
        const { email } = req.body
        const userFound = await User.findOne({ email })
        if(userFound) return res.status(400).json({ message: "User is already registered" })

        const newUser = req.body;
        const hashedPassword = await bcrypt.hash(newUser.password, 10);
        newUser.password = hashedPassword;
        const user = new User(newUser);
        const savedUser = await user.save();
        const token = await createAccessToken({ id: savedUser._id });

        res.cookie("token", token);
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
        res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        const userFound = await User.findOne({ email })
        if(!userFound) return res.status(400).json({ message: "User not found" })

        const isMatch = await bcrypt.compare(password, userFound.password)
        if(!isMatch) return res.status(400).json({ message: "Invalid credentials" })
        
        const token = await createAccessToken({ id: userFound._id });

        res.cookie("token", token);
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
        res.status(500).json({ message: "Internal server error" });
    }
};

export const logout = (req: Request, res: Response) => {
    res.cookie('token', '', {
        expires: new Date(0)
    })
    return res.status(200).json({ message: "User logged out successfully" })
}

export const profile = async (req: Request, res: Response) => {
    const userFound = await User.findById(req.body.id);
    if(!userFound) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({
            id: userFound._id,
            userName: userFound.userName,
            email: userFound.email,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt,
    });
}