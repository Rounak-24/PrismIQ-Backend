import { Router } from "express"
import { jwtAuthMiddleware } from "../../middlewares/jwt.middleware"
import { 
    delSentInvite, 
    getRecievedInvitesHandler, 
    getSentInvitesHandler, 
    declineInvitationHandler,
    acceptInvitationHandler, 
    acceptInvitationFromEmail
} from "./invite.controller";

export const invitationRouter = Router()


invitationRouter.get("/sent", jwtAuthMiddleware, getSentInvitesHandler)
invitationRouter.delete("/sent/:invitationId", jwtAuthMiddleware, delSentInvite)
invitationRouter.get("/recieved", jwtAuthMiddleware, getRecievedInvitesHandler)
invitationRouter.put("/decline/:invitationId", jwtAuthMiddleware, declineInvitationHandler)
invitationRouter.post("/accept/:invitationId", jwtAuthMiddleware, acceptInvitationHandler)
invitationRouter.get("/accept", acceptInvitationFromEmail)