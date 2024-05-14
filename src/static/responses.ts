import { Response } from "express";

export const internalServerError = (res: Response) => res.status(500).json({ code: "error", message: "Internal Server Error" })

export const unauthorizedError = (res: Response) => res.status(401).json({ code: 'error', message: 'Unauthorized' })