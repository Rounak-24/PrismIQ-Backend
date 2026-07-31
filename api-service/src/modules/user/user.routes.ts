import { Router } from "express"
import {
    fetchWorkspacesHandler,  
} from "./user.controllers"

export const userRouter = Router()

userRouter.get("/:userId/workspaces", fetchWorkspacesHandler)
