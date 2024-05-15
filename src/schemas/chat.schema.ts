import { z } from "zod";

export const createMessageSchema = z.object({
    summaryId: z.string({ required_error: "Summary ID is required" }).min(6),
    question: z.string({ required_error: "Question is required" })
})

export const getMessagesSchema = z.object({
    summaryId: z.string({ required_error: "Summary ID is required" }).min(6)
})