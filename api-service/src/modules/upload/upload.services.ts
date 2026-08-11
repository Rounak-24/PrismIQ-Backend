import fs from "fs"
import crypto from "crypto"
import { prisma } from "../../config/prisma"
import { env } from "node:process"
import { supabase } from "../../config/supabase"

export const uploadFileToSupabase = async (file:Express.Multer.File, workspaceId:string)=>{
    try{
        const localFilapath = file.path
        if (!localFilapath) throw Error("Filepath is missing")

        const originalFilename = file.filename.split("-")[0]
        const supabaseId = crypto.randomUUID()
        const supabaseFileName = `workspace-${workspaceId}/${supabaseId}-${originalFilename}`

        const fileBuffer = fs.readFileSync(localFilapath)
        const bucket = env.SUPABASE_BUCKET as string
        
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(supabaseFileName, fileBuffer, {
                contentType: file.mimetype,
                upsert: true
            })

        if(error){
            console.log(error)
            throw Error("Error occured while file uploading in Supabase")
        } else fs.unlinkSync(localFilapath)
        console.log(data.path)
        return data        
        
    } catch (err){
        console.log(`Error occured for uploading file`, err)
        fs.unlinkSync(file.path)
    }   
}


export const createUpload = async (file:Express.Multer.File, 
    {workspaceId, fullname, supabaseFilePath}:  {workspaceId:string, fullname:string, supabaseFilePath: string}
)=>{
    const newUpload = await prisma.fileUpload.create({
        data:{
            filename: file.filename,
            size: file.size.toString(),
            format: file.mimetype,
            workspaceId: workspaceId,
            uploadedBy: fullname,
            supabaseFilePath
        }
    })

    return newUpload
}


export const getUploads = async (workspaceId:string)=>{
    return await prisma.fileUpload.findMany({
        where: { workspaceId: workspaceId },
        select:{
            id: true,
            filename: true,
            uploadedBy: true,
            size: true,
            format: true,
            supabaseFilePath: true
        }
    })
}