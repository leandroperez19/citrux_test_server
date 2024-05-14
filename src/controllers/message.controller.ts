import { Request, Response } from "express"
import { askQuestion } from "../libs/openAI";
import { Message } from "../models/chat.model";
import { internalServerError } from "../static/responses";
import { Summary } from "../models/summary.model";

export const createMessage = async (req: Request, res: Response) => {
    try {
        const { summaryId, question, userId } = req.body;
        const foundSummary = await Summary.findById(summaryId);

        if(!foundSummary) return res.status(404).json({ code: "error", message: "Sorry we couldn't found the article you're asking about" })
        if(!foundSummary.url) return

        const response = await askQuestion(question, foundSummary.url);

        if(!response) return res.status(400).json({ code: "error", message: "Sorry, I couldn't process that question" })
        if(response.code === 'error') return res.status(400).json(response);

        const userMessage = {
            summaryId,
            userId,
            message: question,
            from: 'user'
        }
        const savedUserMsg = await new Message(userMessage).save();

        const AIMessage = {
            summaryId,
            userId,
            message: response.message,
            from: "AI"
        }
        const savedAIMsg = await new Message(AIMessage).save();

        return res.status(201).json({ code: "success", messages: [savedAIMsg, savedUserMsg] });
    } catch (e) {
        console.log(e);
        return internalServerError(res);
    }
}

export const getMessages = async (req: Request, res: Response) => {
    try {
        const { userId, summaryId } = req.body;

        const messages = Message.find({ userId, summaryId })

        if(!messages) return res.status(404).json({ code: "error", message: "Sorry, we couldn't find any messages" })

        return res.status(200).json({ code: "success", messages })

    } catch (e) {
        console.log(e);
        return internalServerError(res);
    }
}