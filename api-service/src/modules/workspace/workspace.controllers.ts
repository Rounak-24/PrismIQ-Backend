import type { Request, Response } from "express"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { ApiError } from "../../utils/ApiError.js"
import { ApiResponse } from "../../utils/ApiResponse.js"
import { workRole, userStatus } from "../../types/enums.js"

import { createInvite } from "../invite/invite.services.js";
import {
    sendInviteEmail,
    getUserDataByEmail, 
    userInWorkspace,
    delWorkspace,
    updateWorkSpace,
    createWorkspace,
    getWorkspaceMembers,
    delWorkspaceMember,
    updateWorkspaceMember,
    leaveWorkspace,
    getUserEmailVerified,
} from "./workspace.services.js"


export const createWorkspaceHandler = asyncHandler(async (req:Request, res:Response)=>{
    const { title } = req.body
    const { id, fullname } = req.user as { id:string, fullname:string }  

    const { emailVerified } = await getUserEmailVerified(id) as { emailVerified:boolean }
    if(!emailVerified) throw new ApiError(401,"Verify your email for creating workspace")
    
    if(!title) throw new ApiError(400, "Workspace title is required")
    
    const workspace = await createWorkspace(title, fullname, id)
    if(!workspace) throw Error("Something went wrong while creating workspace....")

    return res.status(200).json(
        new ApiResponse(200, workspace, "Workspace created successfully")
    )
})

export const sendInviteEmailHandler = asyncHandler(async (req:Request, res:Response)=>{
    const userId = req.user?.id
    const inviterName = req.user?.fullname
    const {
        email,
        role,
        workspaceId,
        workspaceName 
    } = req.body

    if(!email || !role || !workspaceId || !workspaceName){
        throw new ApiError(400,"email, role, workspaceId and workspaceName are required")
    }

    if(!Object.values(workRole).includes(role)){
        throw new ApiError(400, "Invalid role provided")
    }

    const targetUser = await getUserDataByEmail(email)
    if(!targetUser || !targetUser.emailVerified){
        throw new ApiError(404,`User with ${email} has not verified their email or no user exists with the email`)
    }

    const { id, workspaceRoles } = targetUser
    const status = userInWorkspace(workspaceRoles as { workRole:workRole, workspaceId:string }[], workspaceId, role)
    console.log(status)
    switch(status){
        case("PRESENT_WITH_CURR_ROLE"):
            throw new ApiError(400, `${email} user is already present in workspace`)
        
        case("PRESENT_WITH_DIFF_ROLE"):
            throw new ApiError(400, `${email} present in workspace with different role`)
    }

    const invitation = await createInvite(
        id, userId, role, workspaceId
    )

    const sentToId = invitation.invitedToId
    const invitationId = invitation.id
    
    const url = `${req.protocol}://${req.get("host")}/api/v1/invitation/accept?sentToId=${sentToId}&invitationId=${invitationId}`
    await sendInviteEmail(inviterName, email, role, workspaceName, url)

    return res.status(200).json(
        new ApiResponse(200, null, `Invitation email sent to ${email} and created a invitation`)
    )
})

export const leaveWorkspaceHandler = asyncHandler(async (req:Request, res:Response)=>{
    const { workspaceId } = req.params as { workspaceId:string }
    const { role } = req.body
    if(!role || role===workRole.ADMIN){
        throw new ApiError(400, "You are an admin, unable to leave. delete the worksapce")
    }

    const { id } = req.user as { id:string }

    if(!workspaceId){
        throw new ApiError(400, "workspaceId is required")
    }       

    await leaveWorkspace(workspaceId, id)
    return res.json( new ApiResponse(200, null, "Leaved Workspace successfully"))
})


export const delWorkspaceHandler = asyncHandler(async (req:Request, res:Response)=>{
    const { workspaceId } = req.params as { workspaceId:string }

    if(!workspaceId){
        throw new ApiError(400, "workspaceId is required")
    }       

    await delWorkspace(workspaceId)
    return res.json( new ApiResponse(200, null, "Workspace deleted successfully"))
})

export const updateWorkspaceHandler = asyncHandler(async (req:Request, res:Response)=>{
    const { workspaceId } = req.params as { workspaceId:string }   
    const { title } = req.body 

    if(!workspaceId){
        throw new ApiError(400, "workspaceId is required")
    }  

    await updateWorkSpace(workspaceId, title)
    return res.json( new ApiResponse(200, null, "Workspace updated successfully") )
})

export const getWorkspaceMembersHandler = asyncHandler(async (req:Request, res:Response)=>{
    const { workspaceId } = req.params as { workspaceId:string }

    if(!workspaceId){
        throw new ApiError(400, "workspaceId is missing")
    }

    const members = await getWorkspaceMembers(workspaceId)
    return res.json( new ApiResponse(200, members ,"Workspace members has been fetched successfully"))
})

export const delWorkspaceMemberHandler = asyncHandler(async (req:Request, res:Response)=>{
    const { workspaceId, userId } = req.body as { workspaceId:string, userId:string }

    if(!workspaceId || !userId){
        throw new ApiError(400, "workspaceId and userId are required")
    }     

    await delWorkspaceMember(userId, workspaceId)
    return res.json( new ApiResponse(200, null, "Workspace member has been deleted successfully"))
})

export const updateWorkspaceMemberHandler = asyncHandler(async (req:Request, res:Response)=>{
    const { workspaceId, userId, role, status } = req.body
    if(!workspaceId || !userId){
        throw new ApiError(400, "workspaceId and userId are required")
    }

    if(!role && !status) throw new ApiError(400,"role and status both are missing....")

    if(role && role in workRole) throw new ApiError(400,"Invalid role provided")
    if(status && status in userStatus)throw new ApiError(400, "Invalid role or status provided")
    
    const updated = await updateWorkspaceMember(workspaceId, userId, role, status)
    if(!updated) throw Error("Something went wrong while updating....")

    return res.json( new ApiResponse(200, updated[0], "Workspace member has been updated successfully"))
})