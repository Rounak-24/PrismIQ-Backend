import { prisma } from "../../config/prisma.js"

export const fetchWorkspaces = async (userId:string)=>{
    const workspaces = await prisma.role.findMany({
        where:{ 
            userId
        }, select:{
            workspace:{
                select:{
                    id:true,
                    title:true,
                    createdBy:true,
                    createdAt:true,
                }
            }, role:true
        }       
    })

    return workspaces.map((workspace)=>{
        return {
            id:workspace.workspace.id, 
            name:workspace.workspace.title,
            createdBy:workspace.workspace.createdBy,
            createdAt:workspace.workspace.createdAt,
            role:workspace.role
        }
    })
}