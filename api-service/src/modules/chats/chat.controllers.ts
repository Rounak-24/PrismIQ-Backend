import type { Request, Response } from "express"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { ApiError } from "../../utils/ApiError.js"
import { ApiResponse } from "../../utils/ApiResponse.js"

import { 
    createChat,
    delChatSession,
    getChatSessions,
    getMessages,
    updateChatTitle

} from "./chat.services.js"


export const createChatHandler = asyncHandler(async (req:Request, res:Response)=>{
    const { title, workspaceId } = req.body as { title:string, workspaceId:string }
    if(!title || !workspaceId) throw new ApiError(400,"title or workspaceId is missing")

    const create = await createChat(workspaceId, title)
    return res.json(new ApiResponse(200, create, "new chat session has been created"))
})


export const getChatSessionHandler = asyncHandler(async (req:Request, res:Response)=>{
    const { workspaceId } = req.query as { workspaceId:string }
    if(!workspaceId){
        throw new ApiError(400, "workspaceId is required")
    }

    const sessions = await getChatSessions(workspaceId)
    return res.json( new ApiResponse(200, sessions, "Chat sessions fetched successfully") )
})


export const getMsgsHandler = asyncHandler(async (req:Request, res:Response)=>{
    const { id } = req.params as { id:string }
    if(!id){
        throw new ApiError(400, "sessionId is required")
    }

    const msgs = await getMessages(id)
    return res.json( new ApiResponse(200, msgs, "Messages fetched successfully") )
})

export const delChatSessionHandler = asyncHandler(async (req:Request, res:Response)=>{
    const { id } = req.params as { id:string }
    if(!id){
        throw new ApiError(400, "sessionId is required")
    }

    await delChatSession(id)
    return res.json( new ApiResponse(200, null, "Session deleted successfully") )
})

export const updateChatTitleHandler = asyncHandler(async (req:Request, res:Response)=>{
    const { id } = req.params as { id:string }
    if(!id) throw new ApiError(400,"SessionId is required")

    const { title } = req.body
    if(!title) throw new ApiError(400, "New title is required")

    const updated = await updateChatTitle(id, title)
    return res.json( new ApiResponse(200, updated, "Title has been updated"))
})