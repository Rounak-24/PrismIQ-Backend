import { prisma } from "../../config/prisma"
import { addEmailJob, emailQueueJob } from "../../queues/email/email.queue"
import { getInviteUserHTML } from "../../view/email.viewes"
import { workRole, userStatus } from "../../types/enums"
import { connect } from "http2";


export enum userInWorkspaceStatus {
    PRESENT_WITH_CURR_ROLE = "PRESENT_WITH_CURR_ROLE",
    ABSENT = "ABSENT",
    PRESENT_WITH_DIFF_ROLE = "PRESENT_WITH_DIFF_ROLE"
}


export const createWorkspace = async (title:string, userId:string)=>{
    const workspace = await prisma.workspace.create({
        data:{
            title,
            createdBy:userId,
            roles:{
                create:{
                    userId,
                    role: workRole.ADMIN
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


export const getUserDataByEmail = async (email:string)=>{
    const user = await prisma.user.findFirst({
        where:{ email }, 
        select:{
            id: true,
            emailVeriified: true,
            workspaceRoles:{
                select:{
                    workspaceId:true,
                    workRole:true
                }
            }
        }
    })
    
    return user
}

export const userInWorkspace = (workspaces:{workRole:workRole, workspaceId:string}[], workspaceId:string, role:workRole)=>{
    workspaces.forEach((workspace)=>{
        if(workspace.workspaceId===workspaceId && workspace.workRole===role){
            return userInWorkspaceStatus.PRESENT_WITH_CURR_ROLE
        }

        else if(workspace.workspaceId===workspaceId){
            return userInWorkspaceStatus.PRESENT_WITH_DIFF_ROLE
        }
    })

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

export const delWorkspace = async (workspaceId:string)=>{
    await prisma.role.deleteMany({
        where:{
            workspaceId
        }
    })      
}

export const updateWorkSpace = async (id:string, newTitle:string)=>{
    await prisma.workspace.update({
        where: { id: id},
        data:{ title: newTitle }
    })
}

export const getWorkspaceMembers = async (workspaceId:string)=>{
    const members = await prisma.role.findMany({
        where: { workspaceId },
        select:{
            workspaceUser:{
                select:{
                    id: true,
                    fullname: true,
                    email: true,
                }
            },
            workRole: true,
            status: true
        }
    })

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

    await prisma.role.updateMany({
        where: { workspaceId, userId: memberId },
        data:{ status , workRole: role}
    })  
}

export const delWorkspaceMember = async (memberId:string, workspaceId:string)=>{
    await prisma.role.deleteMany({
        where: { workspaceId, userId: memberId }
    })
}

export const joinWorkspace = async (workspaceId:string, userId:string, role:workRole)=>{
    return await prisma.role.create({
        data:{
            workspaceId,
            workRole: role,
            userId
        }
    })
}