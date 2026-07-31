import { Router } from "express"
import {
    registerHandler,
    loginHandler,
    logoutHandler,
    refreshAccessHandler,
    resetPassHandler,
    verifyPassResetOTPHandler,
    forgotPassHandler,
    verifyEmailHandler
} from "./auth.controller.js"


export const authRouter = Router()

authRouter.post('/register', registerHandler)
authRouter.post('/login', loginHandler)
authRouter.post('/forgot-password', forgotPassHandler)
authRouter.post('/verify-otp', verifyPassResetOTPHandler)
authRouter.post('/reset-password', resetPassHandler)
authRouter.post('/verify-email',verifyEmailHandler)
authRouter.post('/refresh',refreshAccessHandler)
authRouter.post('/logout',logoutHandler)