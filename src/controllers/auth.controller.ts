import { Request, Response } from "express";
import { userSchema } from "../schemas/user.schema";
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt";

export const register = async (req: Request, res: Response) => {
    try {
        const validatedUser = userSchema.safeParse(req.body);

        if (!validatedUser.success) {
            return res.status(400).json({ errors: validatedUser.error.issues });
        }

        const newUser = validatedUser.data;
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

export const login = (req: Request, res: Response) => {};
