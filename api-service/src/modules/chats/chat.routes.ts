import { Router } from "express"
import { jwtAuthMiddleware } from '../../middlewares/jwt.middleware'
import { 
    getChatSessionHandler,
    delChatSessionHandler,
    getMsgsHandler

} from "./chat.controllers"


export const chatRouter = Router()

chatRouter.get("/sessions",jwtAuthMiddleware, getChatSessionHandler)
chatRouter.delete("/sessions/:id", jwtAuthMiddleware, delChatSessionHandler)
chatRouter.get("/sessions/:id/messages",jwtAuthMiddleware, getMsgsHandler)