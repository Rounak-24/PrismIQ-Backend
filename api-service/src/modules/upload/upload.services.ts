import fs from "fs"
import { prisma } from "../../config/prisma"
import { env } from "node:process"
import { supabase } from "../../config/supabase"

export const uploadFileToSupabase = async (file:Express.Multer.File, workspaceId:string)=>{
    try{
        const localFilapath = file.path
        if (!localFilapath) throw Error("Filepath is missing")

        const bucket = env.SUPABASE_BUCKET as string
        const supabaseFileName = `workspace-${workspaceId}/${file.filename}`
        const fileBuffer = fs.readFileSync(localFilapath)
        
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

        const urldata = supabase.storage
            .from(bucket)
            .getPublicUrl(data.path)
        
        return urldata.data.publicUrl         
        
    } catch (err){
        console.log(`Error occured for uploading file`, err)
        fs.unlinkSync(file.path)
    }   
}


export const createUpload = async (file:Express.Multer.File, 
    {workspaceId, fullname, publicURL}:  {workspaceId:string, fullname:string, publicURL: string}
)=>{
    const newUpload = await prisma.fileUpload.create({
        data:{
            filename: file.filename,
            size: file.size.toString(),
            format: file.mimetype,
            workspaceId: workspaceId,
            uploadedBy: fullname,
            publicURL
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
            publicURL: true
        }
    })
}