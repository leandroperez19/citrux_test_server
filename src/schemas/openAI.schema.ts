import { string, z } from "zod";

export const openAIResponseSchema = z.object({
    code: z.string().min(4),
    message: z.string().min(5)
})