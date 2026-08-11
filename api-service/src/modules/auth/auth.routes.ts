import { Router } from "express"
import { jwtAuthMiddleware } from '../../middlewares/jwt.middleware'
import {
    registerHandler,
    loginHandler,
    logoutHandler,
    refreshAccessHandler,
    resetPassHandler,
    verifyPassResetOTPHandler,
    forgotPassHandler,
    verifyEmailHandler,
    sendVerifyEmailHandler
} from "./auth.controller.js"


export const authRouter = Router()

authRouter.post('/register', registerHandler)
authRouter.post('/login', loginHandler)
authRouter.post('/forgot-password', forgotPassHandler)
authRouter.post('/verify-otp', verifyPassResetOTPHandler)
authRouter.post('/reset-password', resetPassHandler)
authRouter.get('/verify-email', verifyEmailHandler)
authRouter.post('/refresh', jwtAuthMiddleware, refreshAccessHandler)
authRouter.post('/logout', jwtAuthMiddleware, logoutHandler)
authRouter.post('/send-veriy-email', jwtAuthMiddleware, sendVerifyEmailHandler)