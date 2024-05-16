import { Router } from "express";
import { createSummary, deleteSummary, getSummaries, getSummaryById } from "../controllers/summaries.controller";
import { validateSchema } from "../middlewares/validator.middleware";
import { createSummarySchema, deleteSummarySchema } from "../schemas/summary.schema";
import { authRequired } from "../middlewares/validateToken";

const router = Router()

router.post('/create-summary', validateSchema(createSummarySchema), authRequired, createSummary);

router.delete('/delete-summary/:summary', authRequired, deleteSummary);

router.get('/get-summaries', authRequired, getSummaries);

router.get('/get-summary/:summary', authRequired, getSummaryById);



export default router;