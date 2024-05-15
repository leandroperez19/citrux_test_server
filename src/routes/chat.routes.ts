import { Router } from "express";
import { authRequired } from "../middlewares/validateToken";
import { validateSchema } from "../middlewares/validator.middleware";
import { createMessageSchema, getMessagesSchema } from "../schemas/chat.schema";
import { createMessage, getMessages } from "../controllers/message.controller";

const router = Router()

router.post('/ask-question', validateSchema(createMessageSchema), authRequired, createMessage);

router.get('/get-messages/:summary', authRequired, getMessages)

export default router;