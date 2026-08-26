import { Router } from "express"
import { jwtAuthMiddleware } from '../../middlewares/jwt.middleware.js'
import { 
    getChatSessionHandler,
    delChatSessionHandler,
    getMsgsHandler,
    createChatHandler,
    updateChatTitleHandler

} from "./chat.controllers.js"


export const chatRouter = Router()

chatRouter.get("/sessions",jwtAuthMiddleware, getChatSessionHandler)
chatRouter.delete("/sessions/:id", jwtAuthMiddleware, delChatSessionHandler)
chatRouter.get("/sessions/:id/messages",jwtAuthMiddleware, getMsgsHandler)
chatRouter.post("/sessions", jwtAuthMiddleware, createChatHandler)
chatRouter.put("/sessions/:id", jwtAuthMiddleware, updateChatTitleHandler)