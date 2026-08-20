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
    const uploads = await prisma.fileUpload.findMany({
        where: { workspaceId: workspaceId },
        select:{
            id: true,
            filename: true,
            uploadedBy: true,
            size: true,
            format: true,
            supabaseFilePath: true,
            createdAt: true,
            conversation:{
                select:{
                    id: true
                }
            }
        }
    })

    return uploads.map((upload)=>{
        return{
            id: upload.id,
            filename: upload.filename,
            uploadedBy: upload.uploadedBy,
            size: upload.size,
            format: upload.format,
            supabaseFilePath: upload.supabaseFilePath,
            createdAt: upload.createdAt,
            conversationId: upload.conversation?.id
        }
    })
}


export const delFileFromSupabase = async (supabaseFilePath:string)=>{
    const bucket = env.SUPABASE_BUCKET as string
    console.log(`File has been deleted from supabase`)
    return await supabase.storage.from(bucket).remove([supabaseFilePath])
}

export const delFile = async (fileUploadId:string)=>{
    return await prisma.$transaction(async (tx)=>{
        const file = await tx.fileUpload.delete({
            where: { id:fileUploadId },
            select: { 
                supabaseFilePath: true,
                conversation:{
                    select: { id:true }
                }
            }
        }) 

        const conversationId = file.conversation?.id;

        if (conversationId) {
            await tx.conversation.deleteMany({ 
                where: { id: conversationId } 
            });
        }

        return {
            supabaseFilePath: file.supabaseFilePath
        }
    })
}


export const startFileConv = async (fileUploadId:string, title:string, workspaceId:string)=>{
    return await prisma.$transaction(async (tx)=>{
        const createConv = await tx.conversation.create({
            data:{
                title: title,
                workspaceId: workspaceId,
                fileuploadId: fileUploadId
            },
            select:{
                id: true
            }
        })
        console.log(`conv created, id: ${createConv.id}`)
        await tx.fileUpload.update({
            where: { id: fileUploadId },
            data:{
                conversation:{
                    connect:{
                        id: createConv.id
                    }
                }
            }
        })

        return {
            conversationId: createConv.id
        }
    })
}