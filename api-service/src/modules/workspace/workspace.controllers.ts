import type { Request, Response } from "express"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { ApiError } from "../../utils/ApiError.js"
import { ApiResponse } from "../../utils/ApiResponse.js"
import { workRole, userStatus } from "../../types/enums.js"

import {
    sendInviteEmail,
    getValidUser,
    userInWorkspace,
    delWorkspace,
    updateWorkSpace,
    createWorkspace,
    getWorkspaceMembers,
    delWorkspaceMember,
    updateWorkspaceMember

} from "./workspace.services.js"


export const createWorkspaceHandler = asyncHandler(async (req:Request, res:Response)=>{
    const { title } = req.body
    const { id } = req.user as {id:string}  

    if(!title){
        throw new ApiError(400, "Workspace title is required")
    }

    const workspace = await createWorkspace(title, id)
    return res.status(200).json(
        new ApiResponse(200, workspace, "Workspace created successfully")
    )
})

export const sendInviteEmailHandler = asyncHandler(async (req:Request, res:Response)=>{
    const {
        email,
        role,
        workspaceId,
        workspaceName,
        inviterName
    } = req.body

    const { id } = req.user as {id:string}

    if(!email || !role || !workspaceId || !workspaceName){
        throw new ApiError(400,"email, role, workspaceId and workspaceName are required")
    }

    if(!Object.values(workRole).includes(role)){
        throw new ApiError(400, "Invalid role provided")
    }

    if(!await getValidUser(email)){
        throw new ApiError(404, `User with email ${email} does not exist or has not verified their email`)
    }

    if(await userInWorkspace(id, workspaceId)){
        throw new ApiError(400, `User with email ${email} is already a member of this workspace`)
    }

    const url = `${req.protocol}://${req.get("host")}/workspace/${workspaceId}/join`
    await sendInviteEmail(inviterName, email, role, workspaceName, url)

    return res.status(200).json(
        new ApiResponse(200, null, `Invitation email sent to ${email}`)
    )
})


export const delWorkspaceHandler = asyncHandler(async (req:Request, res:Response)=>{
    const { workspaceId } = req.params as { workspaceId:string }

    if(!workspaceId){
        throw new ApiError(400, "workspaceId is required")
    }       

    await delWorkspace(workspaceId)
    return res.json( new ApiResponse(200, null, "Workspace deleted successfully") )
})

export const updateWorkspaceHandler = asyncHandler(async (req:Request, res:Response)=>{
    const { workspaceId } = req.params as { workspaceId:string }    

    if(!workspaceId){
        throw new ApiError(400, "workspaceId is required")
    }  

    await updateWorkSpace(workspaceId, req.body)
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
    const { workspaceId, userId } = req.params as { workspaceId:string, userId:string }

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

    if(Object(workRole).includes(role) && Object(userStatus).includes(status)){
        throw new ApiError(400, "Invalid role or status provided")
    }

    await updateWorkspaceMember(workspaceId, userId, role, status)
    return res.json( new ApiResponse(200, null, "Workspace member has been updated successfully"))
})