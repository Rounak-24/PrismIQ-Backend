import type { Request, Response } from "express"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { ApiError } from "../../utils/ApiError.js"
import { ApiResponse } from "../../utils/ApiResponse.js"
import { fetchWorkspaces } from "./user.services.js"

export const fetchWorkspacesHandler = asyncHandler(async (req:Request, res:Response)=>{
    const { id } = req.user as {id:string}
    const workspaces = await fetchWorkspaces(id)

    if(workspaces.length!==0) throw new ApiError(404,"No workspaces found")
    else return res.json( new ApiResponse(200,workspaces, "fetched workspaces successfully") )
})