import { z } from "zod";

export const createSummarySchema = z.object({
    url: z
        .string({ required_error: "URL is required" })
        .min(6, "URL must contain more than 6 characters")
        .trim()
        .url("Invalid URL"),
});

export const deleteSummarySchema = z.object({
    summaryId: z.string({ required_error: "Summary ID is required" }).min(6),
});
