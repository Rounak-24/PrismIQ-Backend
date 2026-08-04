import type { Request, Response } from "express"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { ApiError } from "../../utils/ApiError.js"
import { ApiResponse } from "../../utils/ApiResponse.js"
import {
    uploadFileToSupabase,
    createUpload,
    getUploads
} from "./upload.services.js"


function valid_file_type(filename:string){
    return (filename.endsWith(".csv") || filename.endsWith(".xlsx") || filename.endsWith(".xls"))
}


export const fileUploadHandler = asyncHandler(async (req:Request, res:Response)=>{
    const file = req.file
    const { workspaceId } = req.body
    const { fullname } = req.user

    if(!workspaceId){
        throw new ApiError(400, `WorkspaceId is missing`)
    }

    if(!file) {
        throw new ApiError(400,`No file has been provided`)
    }

    if(file.size> 10*1024*1024){
        throw new ApiError(400, `File size exceeded`)
    }

    const originalFilename = file.filename.split("-")[0]
    
    if(!valid_file_type(originalFilename as string)){
        throw new ApiError(400,`Invalid file type`)
    }

    const publicURL = await uploadFileToSupabase(req.file as Express.Multer.File, workspaceId)
    if(!publicURL) throw new ApiError(500, `Error occured while uploading file`)
    
    const upload = await createUpload(file, {
        workspaceId,
        fullname,
        publicURL
    })

    if(!upload) throw new ApiError(500, `Error occured while creating new upload`)

    return res.json( new ApiResponse(200, publicURL, "File has been uploaded successfully"))
})


export const getUploadsHandler = asyncHandler(async (req:Request, res:Response)=>{
    const { workspaceId } = req.params as { workspaceId: string }
    if(!workspaceId) throw new ApiError(400, `WorkspaceId is missing`)

    const uploads = await getUploads(workspaceId)
    return res.json( new ApiResponse(200, uploads, "Uploads fetched successfully"))
})