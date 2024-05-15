import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from "../config";

export const authRequired = async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.cookies;
    if(!token) return res.status(401).json({ code: "error", message: "Unauthorized" })
    jwt.verify(token, TOKEN_SECRET, async (err: unknown, decoded: any) => {
        if(err) return res.status(403).json({ code: "error", message: "Invalid Token" })
        if(!decoded) return res.status(400).json({ code: "error", message: "Sorry, there was an error while validating session" })

        req.body = { ...req.body, userId: decoded.id};
        next()
    })
}