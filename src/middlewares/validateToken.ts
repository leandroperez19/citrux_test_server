import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from "../config";

interface Decoded {
    id: string,
    iat: number,
    exp: number
}


export const authRequired = (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.cookies;
    if(!token) return res.status(401).json({ message: "Unauthorized" })
    jwt.verify(token, TOKEN_SECRET, (err: unknown, decoded: unknown) => {
        if(err) return res.status(403).json({ message: "Invalid Token" })
        req.body = decoded;
        next()
    })
}