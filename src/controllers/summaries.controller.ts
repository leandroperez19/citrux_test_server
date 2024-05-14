import { Request, Response } from "express";
import { createAISummary } from "../libs/openAI";
import { Summary } from "../models/summary.mode";

export const createSummary = async (req: Request, res: Response) => {
    try {
        const { url, userId } = req.body;
        const response = await createAISummary(url);

        if(!response) return res.status(400).json({ code: "error", message: "Sorry, we couldn't summarize that, please try again" })
        if(response.code === 'error') return res.status(400).json(response)

        const summary = {
            url,
            content: response.message,
            userId
        }
        const newSummary = new Summary(summary)
        const savedSummary = await newSummary.save();
  
        return res.status(200).json({ message: "Summary created successfully", summary: {
            url: savedSummary.url,
            content: savedSummary.content,
            createdAt: savedSummary.createdAt,
            updatedAt: savedSummary.updatedAt
        } })
    } catch (e) {
        console.log(e);
        return res.status(500).json({ code: "error", message: "Internal Server error" })
    }
}