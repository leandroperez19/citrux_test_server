import OpenAI from "openai";
import { openAIResponseSchema } from "../schemas/openAI.schema";

const openAI = new OpenAI();

interface OpenAIResponse {
    code: string,
    message: string
}

export const askQuestion = async (msg: string, article: string) => {
    const question = 
    `could you answer this question or message ${msg}. 
    But only if it refers to this article ${article}. 
    always return a JSON with this format:
    { 
        code: if the question refers to the article: "success" | if it doesn't refers to the article or is something random: "error",
        message: if code "success": your answer to the question | if code "error": "Sorry I can only answer question that have something to do with the article" or something more polite if you like
    }
    also if you can access the article return:
    {
        code: "error",
        message: "Sorry, I was unable to access the article"
    }
    `
    return baseAIget(question)
}

export const createAISummary = async (question: string) => {
    const ask = 
    `could you make a summary of this article 
    ${question}? always return a JSON with this format 
    { code: if you could create it: "success" | if it's not an article or you couldn't create it: "error", 
    message: if code success the article summary if you could do it in html format with h and p that'd be awesome  
    | if code error: error message }`;
    return baseAIget(ask);
};

export const baseAIget = async (content: string): Promise<OpenAIResponse> => {
    try {
        const completion = await openAI.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content,
                },
            ],
            model: "gpt-3.5-turbo",
            response_format: { type: "json_object" },
        });

        const response = JSON.parse((completion.choices[0].message.content ?? ''))
        const validResponse = openAIResponseSchema.parse(response)

        if(!validResponse) return { code: "error", message: "Sorry, there was an error" }
        return validResponse;
    } catch (e) {
        console.log(e);
        return { code: "error", message: "Sorry, there was an error" }
    }
};
