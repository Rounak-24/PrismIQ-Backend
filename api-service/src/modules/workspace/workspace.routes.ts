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
    leaveWorkspaceHandler
} from "./workspace.controllers"

export const workspaceRouter = Router()

workspaceRouter.post("/", jwtAuthMiddleware, createWorkspaceHandler)
workspaceRouter.delete("/:workspaceId", jwtAuthMiddleware, delWorkspaceHandler)
workspaceRouter.put("/users", jwtAuthMiddleware, updateWorkspaceMemberHandler)
workspaceRouter.put("/:workspaceId", jwtAuthMiddleware, updateWorkspaceHandler)
workspaceRouter.post("/invite", jwtAuthMiddleware, sendInviteEmailHandler)
workspaceRouter.get("/:workspaceId/members", jwtAuthMiddleware, getWorkspaceMembersHandler)
workspaceRouter.post("/users/delete", jwtAuthMiddleware, delWorkspaceMemberHandler)
workspaceRouter.post("/leave/:workspaceId", jwtAuthMiddleware, leaveWorkspaceHandler)