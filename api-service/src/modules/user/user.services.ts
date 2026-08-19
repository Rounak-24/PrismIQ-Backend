import { prisma } from "../../config/prisma.js"


export const fetchUserData = async (userId:string)=>{

    const res = await prisma.user.findUnique({
        where: { id: userId },
        select:{
            emailVerified: true,
            workspaceRoles:{
                select:{
                    workspace:{
                        select:{
                            id: true,
                            title: true,
                            createdAt: true,
                            createdBy: true
                        }
                    },
                    status: true,
                    workRole: true
                }
            }
        }
    })

    const workspaces = res?.workspaceRoles.map((role)=>{
        return {
            id:role.workspace.id, 
            name:role.workspace.title,
            createdBy:role.workspace.createdBy,
            createdAt:role.workspace.createdAt,
            role:role.workRole,
            status:role.status
        }
    })

    return {
        workspaces, 
        emailVerified: res?.emailVerified
    }
}

export const updateFullname = async (userId:string, newName:string)=>{
    const updated = await prisma.user.update({
        where: { id:userId },
        data:{ fullname: newName }, 
        select: { fullname:true }
    })

    return updated
}

export const deactivateAcc = async (userId:string)=>{
    return await prisma.user.update({
        where: { id:userId },
        data: { isActive:false },
        select: { isActive:true }
    })
}