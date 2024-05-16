import { Request, Response } from "express"
import { askQuestion } from "../libs/openAI";
import { Message } from "../models/chat.model";
import { internalServerError } from "../static/responses";
import { Summary } from "../models/summary.model";

const saveMessage = async (summaryId: string, userId: string, message: string, from: string) => {
    const newMessage = new Message({ summaryId, userId, message, from });
    return await newMessage.save();
}

export const createMessage = async (req: Request, res: Response) => {
    try {
        const { summaryId, question, userId } = req.body;
        const foundSummary = await Summary.findById(summaryId);

        if(!foundSummary) return res.status(404).json({ code: "error", message: "Sorry we couldn't found the article you're asking about" })
        if(!foundSummary.url) return

        const previousQuestions = await Message.find({ summaryId });

        if(previousQuestions && previousQuestions.length > 0) {
            const newArray = [];

            for (const element of previousQuestions.slice(0, 10)) {
                const role = element.from === "user" ? "user" : "system";
                const content = element.message;

                const newObject = {
                    role,
                    content
                };

                newArray.push(newObject);
            }

            const response = await askQuestion(question, foundSummary.url, newArray);
            
            if(!response) return res.status(400).json({ code: "error", message: "Sorry, I couldn't process that question" })
            if(response.code === 'error') return res.status(400).json(response);

            await saveMessage(summaryId, userId, question, 'user');
            await saveMessage(summaryId, userId, response.message, "AI");

            return res.status(201).json({ code: "success", message: "Question created successfully" })
        }

        const response = await askQuestion(question, foundSummary.url);

        if(!response) return res.status(400).json({ code: "error", message: "Sorry, I couldn't process that question" })
        if(response.code === 'error') return res.status(400).json(response);

        await saveMessage(summaryId, userId, question, 'user');
        await saveMessage(summaryId, userId, response.message, "AI");

        return res.status(201).json({ code: "success", message: "Question created successfully" });
    } catch (e) {
        console.log(e);
        return internalServerError(res);
    }
}

export const getMessages = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;
        const { summary } = req.params;

        const messages = await Message.find({ userId, summaryId: summary })

        if(!messages) return res.status(404).json({ code: "error", message: "Sorry, we couldn't find any messages" })

        return res.status(200).json({ code: "success", messages })

    } catch (e) {
        console.log(e);
        return internalServerError(res);
    }
}