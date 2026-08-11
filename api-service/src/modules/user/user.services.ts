import { prisma } from "../../config/prisma.js"
import { updateCache, getAllCachedFields } from "../../services/cache.services.js";
import { cacheField } from "../../types/enums.js";



export const fetchUserData = async (userId:string)=>{
    const cache = await getAllCachedFields(userId)

    if(cache){
        const workspaceStr = cache.workspaces
        const emailVerified = cache.emailVerified

        if(workspaceStr) return {
            workspaces: JSON.parse(workspaceStr),
            emailVerified
        }
    }

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
            role:role.workRole
        }
    })

    const workspaceStr = JSON.stringify(workspaces)
    await updateCache(cacheField.WORKSPACE, workspaceStr, userId)

    return {
        workspaces, 
        emailVerified: res?.emailVerified
    }
}