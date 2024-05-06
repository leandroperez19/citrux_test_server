import { NextFunction, Request, Response } from "express";
import { ZodError, ZodObject } from "zod";

export const validateSchema = (schema: ZodObject<any>) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        const zodError = error as ZodError;
        return res.status(400).json({ error: zodError.errors.map(err => err.message) })
    }
}