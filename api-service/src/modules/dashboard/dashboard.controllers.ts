import type { Request, Response } from "express"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { ApiError } from "../../utils/ApiError.js"
import { ApiResponse } from "../../utils/ApiResponse.js"

import {
    getDashboards,
    saveDashboard,
    delDashboard
} from './dashboard.services.js'

import type { IDashboard } from "../../types/interfaces.js"


export const createDashboardHandler = asyncHandler(async (req:Request, res:Response)=>{
    const { workspaceId, dashboard } = req.body as {workspaceId:string, dashboard:IDashboard}

    if(!workspaceId || !dashboard){
        throw new ApiError(400, "Missing required fields")
    }

    const newDashboard = await saveDashboard(workspaceId, dashboard)
    res.json( new ApiResponse(200, newDashboard, "Dashboard created successfully"))     
})

export const deleteDashboardHandler = asyncHandler(async (req:Request, res:Response)=>{
    const { id } = req.params as {id:string}

    await delDashboard(id)
    res.json( new ApiResponse(200, null, "Dashboard deleted successfully"))     
})

export const getDashboardsHandler = asyncHandler(async (req:Request, res:Response)=>{
    const { workspaceId } = req.query as {workspaceId:string} 
    const dashboards = await getDashboards(workspaceId)

    return res.json( new ApiResponse(200, dashboards, "Dashboards fetched successfully"))     
})