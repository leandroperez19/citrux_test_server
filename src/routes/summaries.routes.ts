import { Router } from "express";
import { createSummary } from "../controllers/summaries.controller";
import { validateSchema } from "../middlewares/validator.middleware";
import { createSummarySchema } from "../schemas/summary.schema";

const router = Router()

router.post('/create-summary', validateSchema(createSummarySchema), createSummary);

export default router;