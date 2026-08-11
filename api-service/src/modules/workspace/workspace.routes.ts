import { Router } from "express"
import { jwtAuthMiddleware } from '../../middlewares/jwt.middleware'
import {
    delWorkspaceHandler,
    updateWorkspaceHandler,
    sendInviteEmailHandler,
    createWorkspaceHandler,
    getWorkspaceMembersHandler,
    updateWorkspaceMemberHandler,
    delWorkspaceMemberHandler,
    joinWorkspaceHandler
    
} from "./workspace.controllers"

export const workspaceRouter = Router()

workspaceRouter.post("/", jwtAuthMiddleware, createWorkspaceHandler)
workspaceRouter.delete("/:workspaceId", jwtAuthMiddleware, delWorkspaceHandler)
workspaceRouter.put("/:workspaceId", jwtAuthMiddleware, updateWorkspaceHandler)
workspaceRouter.post("/invite", jwtAuthMiddleware, sendInviteEmailHandler)
workspaceRouter.get("/:workspaceId/members", jwtAuthMiddleware, getWorkspaceMembersHandler)
workspaceRouter.put("/users", jwtAuthMiddleware, updateWorkspaceMemberHandler)
workspaceRouter.get("/users/delete", jwtAuthMiddleware, delWorkspaceMemberHandler)
workspaceRouter.post("/workspace/:workspaceId/join", jwtAuthMiddleware, joinWorkspaceHandler)