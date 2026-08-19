import type { Request, Response } from "express"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { ApiError } from "../../utils/ApiError.js"
import { ApiResponse } from "../../utils/ApiResponse.js"

import { 
    deactivateAcc, 
    fetchUserData, 
    updateFullname 
} from "./user.services.js"


export const fetchWorkspacesHandler = asyncHandler(async (req:Request, res:Response)=>{
    const { id } = req.user as { id:string }
    const { workspaces, emailVerified } = await fetchUserData(id)
    console.log(workspaces)
    if(!workspaces || workspaces.length===0) return res.json(
        new ApiResponse(200,{
            workspaces:null,
            emailVerified 
        },"user has no workspace")
    )
    else return res.json( new ApiResponse(200,{
        workspaces: workspaces,
        emailVerified
    }, "fetched workspaces successfully") )
})


export const updateFullnameHandler = asyncHandler(async (req:Request, res:Response)=>{
    const { id } = req.user as { id:string }
    const { name } = req.body as { name:string }
    if(!name) throw new ApiError(400,"New name is required")

    const updated = await updateFullname(id, name)
    if(!updated) throw Error("Something went wrong while updating....")

    res.json( new ApiResponse(200, {name: updated.fullname }, "Name has been updated successfully"))
})

export const deactiveAccHandler = asyncHandler(async (req:Request, res:Response)=>{
    const { id } = req.user as { id:string }

    const deactivated = await deactivateAcc(id)
    if(!deactivated) throw new Error("Something went wrong while deactivating acc...")

    return res.json( new ApiResponse(200,{
        isActive: deactivated.isActive
    }, "Account has been deactivated successfully"))
})