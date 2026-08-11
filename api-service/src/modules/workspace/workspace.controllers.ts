import type { Request, Response } from "express"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { ApiError } from "../../utils/ApiError.js"
import { ApiResponse } from "../../utils/ApiResponse.js"
import { workRole, userStatus } from "../../types/enums.js"

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
    joinWorkspace,
    leaveWorkspace,
    removeWorkspaceFromCache,
    getUserEmailVerified

} from "./workspace.services.js"


export const createWorkspaceHandler = asyncHandler(async (req:Request, res:Response)=>{
    const { title } = req.body
    const { id } = req.user as { id:string, emailVerified:boolean }  

    const { emailVerified } = await getUserEmailVerified(id) as { emailVerified:boolean }
    if(!emailVerified) throw new ApiError(401,"Verify your email for creating workspace")
    
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

    if(!email || !role || !workspaceId || !workspaceName){
        throw new ApiError(400,"email, role, workspaceId and workspaceName are required")
    }

    if(!Object.values(workRole).includes(role)){
        throw new ApiError(400, "Invalid role provided")
    }

    const user = await getUserDataByEmail(email)

    if(!user || !user.emailVerified){
        throw new ApiError(404,`User with ${email} has not verified their email or no user exists with the email`)
    }

    const { id, workspaceRoles } = user
    const status = userInWorkspace(workspaceRoles as { workRole:workRole, workspaceId:string }[], workspaceId, role)

    switch(status){
        case("PRESENT_WITH_CURR_ROLE"):
            throw new ApiError(400, `${email} user is already present in workspace`)
        
        case("PRESENT_WITH_DIFF_ROLE"):
            throw new ApiError(400, `${email} present in workspace with role: ${role}`)
    }

    const url = `${req.protocol}://${req.get("host")}/workspace/${workspaceId}/join/?userId=${id}&role=${role}`
    await sendInviteEmail(inviterName, email, role, workspaceName, url)

    return res.status(200).json(
        new ApiResponse(200, null, `Invitation email sent to ${email}`)
    )
})


export const joinWorkspaceHandler = asyncHandler(async (req:Request, res:Response)=>{
    const { workspaceId } = req.params as { workspaceId: string }
    const { userId, role } = req.query as { userId:string, role:workRole}

    const joined = await joinWorkspace(workspaceId, userId, role)

    return res.json( new ApiResponse(200, `Successfully joined workspace`))
})


export const leaveWorkspaceHandler = asyncHandler(async (req:Request, res:Response)=>{
    const { workspaceId } = req.params as { workspaceId:string }
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
    res.json( new ApiResponse(200, null, "Workspace deleted successfully") )
    return await removeWorkspaceFromCache(req.user?.id)
})

export const updateWorkspaceHandler = asyncHandler(async (req:Request, res:Response)=>{
    const { workspaceId } = req.params as { workspaceId:string }   
    const { title } = req.body 

    if(!workspaceId){
        throw new ApiError(400, "workspaceId is required")
    }  

    await updateWorkSpace(workspaceId, title)
    res.json( new ApiResponse(200, null, "Workspace updated successfully") )
    return await removeWorkspaceFromCache(req.user?.id)
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