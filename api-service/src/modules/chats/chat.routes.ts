import { Router } from "express"
import { 
    getChatSessionHandler,
    delChatSessionHandler,
    getMsgsHandler

} from "./chat.controllers"


export const chatRouter = Router()

chatRouter.get("/sessions",getChatSessionHandler)
chatRouter.delete("/sessions/:id",delChatSessionHandler)
chatRouter.get("/sessions/:id/messages",getMsgsHandler)