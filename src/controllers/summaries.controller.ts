import { Request, Response } from "express";
import { createAISummary } from "../libs/openAI";
import { Summary } from "../models/summary.model";
import { internalServerError } from "../static/responses";

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
            updatedAt: savedSummary.updatedAt,
            id: savedSummary.id
        } })
    } catch (e) {
        console.log(e);
        return internalServerError(res)
    }
}

export const deleteSummary = async (req: Request, res: Response) => {
    try {
        const { summaryId } = req.body;
        const summaryDeleted = await Summary.findByIdAndDelete(summaryId);

        if(!summaryDeleted) return res.status(400).json({ code: 'error', message: "Sorry, we couldn't find that summary" })
        
        return res.status(200).json({ code: "success", message: `${summaryId} deleted successfully` })

    } catch (e) {
        console.log(e);
        return internalServerError(res)
    }
}

export const getSummaries = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;
        const summaries = await Summary.find({ userId });

        if(!summaries) return res.status(400).json({ code: "error", message: "Sorry, seems like you don't have any summary yet." })
        
        return res.status(200).json({ code: "success", summaries })
    } catch (e) {
        console.log(e);
        return internalServerError(res)
    }
}

export const getSummaryById = async (req: Request, res: Response) => {
    try {
        const { summary } = req.params;
        const foundSummary = await Summary.findById(summary);

        if(!summary) return res.status(400).json({ code: "error", message: "We searched the entire galaxy. Unfortunately, no summaries were found." })
        
        return res.status(200).json({ code: "success", summary: foundSummary })
    } catch (e) {
        console.log(e);
        return internalServerError(res)
    }
}