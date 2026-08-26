import { prisma } from "../../config/prisma"
import { addEmailJob, emailQueueJob } from "../../queues/email/email.queue"
import { getInviteUserHTML } from "../../view/email.viewes"
import { workRole, userStatus } from "../../types/enums"

export enum userInWorkspaceStatus {
    PRESENT_WITH_CURR_ROLE = "PRESENT_WITH_CURR_ROLE",
    ABSENT = "ABSENT",
    PRESENT_WITH_DIFF_ROLE = "PRESENT_WITH_DIFF_ROLE"
}


export const createWorkspace = async (title:string, fullname:string, userId:string)=>{
    const workspace = await prisma.workspace.create({
        data:{
            title,
            createdBy:fullname,
            userRoles:{
                create:{
                    workRole: workRole.ADMIN,
                    workspaceUser:{
                        connect:{ id: userId }
                    }
                }
            }
        },
        select:{
            id:true,
            title:true,
            createdAt:true,
            createdBy:true
        }
    })

    return {
        id:workspace.id,
        name:workspace.title,
        createdAt:workspace.createdAt,
        createdBy:workspace.createdBy
    }
}


export const getUserEmailVerified = async (userId:string)=>{
    return await prisma.user.findUnique({
        where :{ id: userId },
        select:{ emailVerified:true }
    })
}


export const getUserDataByEmail = async (email:string)=>{
    return await prisma.user.findFirst({
        where:{ email:email, isActive:true }, 
        select:{
            id: true,
            emailVerified: true,
            workspaceRoles:{
                select:{
                    workspaceId:true,
                    workRole:true
                }
            }
        }
    })
}

export const userInWorkspace = (
    workspaces:{workRole:workRole, workspaceId:string}[], 
    workspaceId:string, 
    role:workRole
)=>{

    const userExistsWithRole = workspaces.some((workspace)=>
        workspace.workspaceId===workspaceId && workspace.workRole===role
    )
    if(userExistsWithRole) return userInWorkspaceStatus.PRESENT_WITH_CURR_ROLE

    const userExitsWithDiffRole = workspaces.some((workspace)=>
        workspace.workspaceId===workspaceId
    )
    if(userExitsWithDiffRole) return userInWorkspaceStatus.PRESENT_WITH_DIFF_ROLE 

    return userInWorkspaceStatus.ABSENT
}

export const sendInviteEmail = async (sender:string, to:string, role:string, workspaceName:string, url:string)=>{
    const mailHTML = getInviteUserHTML(sender,role,workspaceName,url)

    await addEmailJob({
        mailHTML,
        email:to,
        subject: "New workspace joining offer!"

    },emailQueueJob.SEND_INVITE_EMAIL)
}

export const leaveWorkspace = async (workspaceId:string, userId:string)=>{
    await prisma.role.deleteMany({
        where:{
            workspaceId,
            userId: userId
        }
    })  
}

export const delWorkspace = async (workspaceId:string)=>{
    await prisma.workspace.delete({where:{ id:workspaceId }})
}

export const updateWorkSpace = async (id:string, newTitle:string)=>{
    await prisma.workspace.update({
        where: { id: id },
        data:{ title: newTitle },
        select:{ title: true }
    })
}

export const getWorkspaceMembers = async (workspaceId:string)=>{
    const res = await prisma.role.findMany({
        where: { workspaceId },
        select:{
            workspaceUser:{
                select:{
                    id: true,
                    fullname: true,
                    email: true,
                    isActive: true
                }
            },
            workRole: true,
            status: true
        }
    })

    const members = res.filter(
        (resObj)=> resObj.workspaceUser.isActive!==false
    )

    return members.map((member)=>{
        return {
            id: member.workspaceUser.id,
            name: member.workspaceUser.fullname,
            email: member.workspaceUser.email,
            role: member.workRole,
            status: member.status
        }
    })
}


export const updateWorkspaceMember = 
async (workspaceId:string, memberId:string, role:workRole, status:userStatus)=>{
    if(status && role){
        return await prisma.role.updateManyAndReturn({
            where:{ workspaceId, userId: memberId },
            data:{ status , workRole: role},
            select:{ status:true, workRole:true }
        })
    }

    if(status){
        return await prisma.role.updateManyAndReturn({
            where:{ workspaceId, userId: memberId },
            data:{ status:status },
            select:{ status:true }
        })
    }

    if(role){
        return await prisma.role.updateManyAndReturn({
            where:{ workspaceId, userId: memberId },
            data:{ workRole:role },
            select:{ workRole:true }
        })
    }
}

export const delWorkspaceMember = async (memberId:string, workspaceId:string)=>{
    await prisma.role.deleteMany({
        where: { workspaceId, userId: memberId }
    })
}