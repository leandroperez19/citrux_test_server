import { Router } from "express";
import { login, logout, profile, register } from "../controllers/auth.controller";
import { authRequired } from "../middlewares/validateToken";
import { validateSchema } from "../middlewares/validator.middleware";
import { userLoginSchema, userRegisterSchema } from "../schemas/user.schema";

const router = Router();

router.post('/register', validateSchema(userRegisterSchema), register)

router.post('/login', validateSchema(userLoginSchema), login)

router.post('/logout', logout)

router.get('/profile', authRequired, profile)

export default router;