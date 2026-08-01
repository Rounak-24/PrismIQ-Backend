import type { Request, Response } from "express"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { ApiError } from "../../utils/ApiError.js"
import { ApiResponse } from "../../utils/ApiResponse.js"

import { 
    delChatSession,
    getChatSessions,
    getMessages

} from "./chat.services.js"


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