import { Router } from "express"
import { jwtAuthMiddleware } from '../../middlewares/jwt.middleware'
import {
    fetchWorkspacesHandler,  
} from "./user.controllers"

export const userRouter = Router()

userRouter.get("/:userId/workspaces", jwtAuthMiddleware , fetchWorkspacesHandler)
