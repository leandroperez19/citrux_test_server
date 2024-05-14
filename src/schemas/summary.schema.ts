import { z } from "zod";

export const createSummarySchema = z.object({
    url: z
        .string({ required_error: "URL is required" })
        .min(6, "URL must contain more than 6 characters")
        .trim(),
    userId: z
        .string({ required_error: "User ID is required" })
        .min(5, "User ID must contain more than 5 characters"),
});
