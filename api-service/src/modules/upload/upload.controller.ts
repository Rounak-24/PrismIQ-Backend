import type { Request, Response } from "express"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { ApiError } from "../../utils/ApiError.js"
import { ApiResponse } from "../../utils/ApiResponse.js"
import {
    uploadFileToSupabase,
    createUpload,
    getUploads,
    delFile,
    delFileFromSupabase,
    startFileConv
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

    const upload = await uploadFileToSupabase(req.file as Express.Multer.File, workspaceId)
    if(!upload) throw new ApiError(500, `Error occured while uploading file`)
    
    const save = await createUpload(file, {
        workspaceId,
        fullname,
        supabaseFilePath: upload.path
    })

    if(!save) throw new Error(`Something went wrong while saving new upload`)
    return res.json( new ApiResponse(200, save, "File has been uploaded successfully"))
})


export const getUploadsHandler = asyncHandler(async (req:Request, res:Response)=>{
    const { workspaceId } = req.query as { workspaceId: string }
    if(!workspaceId) throw new ApiError(400, `WorkspaceId is missing`)
    
    const uploads = await getUploads(workspaceId)
    return res.json( new ApiResponse(200, uploads, "Uploads fetched successfully"))
})

export const delFileUploadHandler = asyncHandler(async (req:Request, res:Response)=>{
    const { id } = req.params as { id:string }
    const { supabaseFilePath } = await delFile(id)

    const { data, error } = await delFileFromSupabase(supabaseFilePath)
    if(error) throw new ApiError(500, "Error occured while deleting file from supabase.....")

    return res.json( new ApiResponse(200,null,"file has been deleted successfully"))
})

export const startFileConvHandler = asyncHandler(async (req:Request, res:Response)=>{
    const { workspaceId, title, fileId } = req.body
    if(!workspaceId || !title || !fileId) throw new ApiError(400,"workspaceId, title, fileId all are required")

    const { conversationId } = await startFileConv(fileId, title, workspaceId)
    if(!conversationId) throw Error("Something went wrong while starting file conversation....")

    res.json( new ApiResponse(200,{
        fileId: fileId,
        conversationId: conversationId
    },"File conversation created successfully"))
})