import { string, z } from "zod";

export const openAIResponseSchema = z.object({
    code: string().min(4),
    message: string().min(5)
})