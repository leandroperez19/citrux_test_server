import { Router } from "express";
import { login, logout, profile, register, requestOTP, updatePassword } from "../controllers/auth.controller";
import { authRequired } from "../middlewares/validateToken";
import { validateSchema } from "../middlewares/validator.middleware";
import { requestOTPSchema, updatePasswordSchema, userLoginSchema, userRegisterSchema } from "../schemas/user.schema";
import { OTPCheck, validateOTP } from "../middlewares/validateOTP";

const router = Router();

router.post('/register', validateSchema(userRegisterSchema), register)

router.post('/login', validateSchema(userLoginSchema), login)

router.post('/logout', logout)

router.post('/request-otp', validateSchema(requestOTPSchema), OTPCheck, requestOTP)

router.put('/update-user', validateSchema(updatePasswordSchema), validateOTP, updatePassword)

router.get('/profile', authRequired, profile)

export default router;