import { Router } from "express"
import {
    delWorkspaceHandler,
    updateWorkspaceHandler,
    sendInviteEmailHandler,
    createWorkspaceHandler,
    getWorkspaceMembersHandler,
    updateWorkspaceMemberHandler,
    delWorkspaceMemberHandler
} from "./workspace.controllers"

export const workspaceRouter = Router()

workspaceRouter.post("/", createWorkspaceHandler)
workspaceRouter.delete("/:workspaceId", delWorkspaceHandler)
workspaceRouter.put("/:workspaceId", updateWorkspaceHandler)
workspaceRouter.post("/invite", sendInviteEmailHandler)
workspaceRouter.get("/:workspaceId/members", getWorkspaceMembersHandler)
workspaceRouter.put("/users", updateWorkspaceMemberHandler)
workspaceRouter.get("/users/delete", delWorkspaceMemberHandler)

