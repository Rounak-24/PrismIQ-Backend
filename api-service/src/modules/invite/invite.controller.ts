import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { getJoinedHTML } from "../../view/response.view.js";

import { 
    acceptInviteAndCreateRole, 
    declineInvitation, 
    delSentInvites, 
    getRecievedInvites, 
    getSentInvites 
} from "./invite.services.js";


export const getSentInvitesHandler = asyncHandler(async (req:Request, res:Response)=>{
    const { id } = req.user as { id:string }
    const { workspaceId } = req.query as { workspaceId:string }
    if(!workspaceId) throw new ApiError(400, "workspaceId is required")

    const sentInvites = await getSentInvites(id, workspaceId)

    return res.json( new ApiResponse(200, sentInvites, "sent invites has been fetched successfully"))
})

export const delSentInvite = asyncHandler(async (req:Request, res:Response)=>{
    const { invitationId } = req.params as { invitationId:string }
    if(!invitationId) throw new ApiError(400, "invitationId is required")

    await delSentInvites(invitationId)

    return res.json(new ApiResponse(200, null, "sent invite has been deleted successfully"))
})


export const getRecievedInvitesHandler = asyncHandler(async (req:Request, res:Response)=>{
    const { id } = req.user as { id:string }
    const recievedInvites = await getRecievedInvites(id)
    return res.json( new ApiResponse(200, recievedInvites, "received invites has been fetched successfully"))
})


export const declineInvitationHandler = asyncHandler(async (req:Request, res:Response)=>{
    const { invitationId } = req.params as { invitationId:string }
    if(!invitationId) throw new ApiError(400, "invitationId is required")  

    await declineInvitation(invitationId)

    return res.json(new ApiResponse(200, null, "received invite has been updated successfully"))
})


export const acceptInvitationHandler = asyncHandler(async (req:Request, res:Response)=>{
    const { invitationId } = req.params as { invitationId:string }
    const { id } =  req.user as { id:string }
    if(!invitationId) throw new ApiError(400,"invitationId is required")

    const workspace = await acceptInviteAndCreateRole(invitationId, id)
    if(!workspace) throw new ApiError(500, "Something went wrong while joining workspace")

    return res.json( new ApiResponse(200, null, "Invitation has been accepted"))
})


export const acceptInvitationFromEmail = asyncHandler(async (req:Request, res:Response)=>{
    const { sentToId, invitationId } = req.query as { sentToId:string, invitationId:string}
    if(!sentToId || !invitationId) throw new ApiError(200, "required fields are missing in url")

    const workspace = await acceptInviteAndCreateRole(invitationId, sentToId)
    if(!workspace) throw new ApiError(500, "Something went wrong while joining workspace")

    const reeponseHTML = getJoinedHTML(process.env.APP_URL as string, workspace.title)
    return res.status(200).send(reeponseHTML)
})