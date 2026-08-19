import { Router } from "express"
import { jwtAuthMiddleware } from '../../middlewares/jwt.middleware'
import {
    deactiveAccHandler,
    fetchWorkspacesHandler,
    updateFullnameHandler,  
} from "./user.controllers"

export const userRouter = Router()

userRouter.get("/:userId/workspaces", jwtAuthMiddleware , fetchWorkspacesHandler)
userRouter.put("/profile", jwtAuthMiddleware , updateFullnameHandler)
userRouter.post("/deactivate", jwtAuthMiddleware , deactiveAccHandler)
