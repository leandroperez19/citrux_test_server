import OpenAI from "openai";
import { openAIResponseSchema } from "../schemas/openAI.schema";
import { ChatCompletionMessageParam } from "openai/resources";

const openAI = new OpenAI();

interface OpenAIResponse {
    code: string,
    message: string
}

export const askQuestion = async (msg: string, article: string, previousQuestions?: {role: string, content: string}[]) => {
    const question = 
    `Please answer this question ${msg} if it's related to the article: ${article} or related to a previous question. 
    always return a JSON with this format:
    { 
        code: the question is related to the article or previous questions: "success"| if it's not or you cannot access the article: "error",
        message: if code "success": your answer to the question | if code "error": the error
    }
    `
    return baseAIget(question, previousQuestions)
}

export const createAISummary = async (link: string) => {
    // const ask = 
    // `If this ${link} is a link please crate a summary of it only if it's an informative article, like news, press or an informative page, don't accept links from social media, stores, or pages that are not informative. 
    // always return a JSON with this format 
    // { 
    //     code: if it's a link and is accessible and an informative article: "success" | if not: "error", 
    //     message: if code "success": the article or product summary in html format with a <h2> with the summary title and rest just a <p> or multiple <p>  
    //     | if code error: error message
    // }`;

    const ask2 = `
        An explanation of how what you gonna return like if it was code
        if(${link} !== a link) return { code: "error", message: "Invalid link, please provide a valid one" }
        if(!${link}) return { code: "error", message: "Sorry, I was unable to access that link" }
        if(!${link}.include['wikis', 'news', 'informative articles', 'press']) return { code: "error", message: "Sorry, I can only summarize informative articles" }
        return { code: "success", message: a summary of the article with HTML format, a title for the summary in an h2, and the rest just p }
    `

    return baseAIget(ask2);
};

export const baseAIget = async (content: string, previousQuestion?: any): Promise<OpenAIResponse> => {
    const previous = previousQuestion ? previousQuestion : null;
    const message = { role: "system", content }

    try {
        const completion = await openAI.chat.completions.create({
            messages: previous ? [...previous, message] : [message],
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
