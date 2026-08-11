import type { Request, Response } from "express"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { ApiError } from "../../utils/ApiError.js"
import { ApiResponse } from "../../utils/ApiResponse.js"
import { fetchUserData } from "./user.services.js"

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