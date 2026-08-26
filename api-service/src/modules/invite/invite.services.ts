import { prisma } from "../../config/prisma.js"
import { InvitationStatus, workRole } from "../../types/enums.js"


export const getSentInvites = async (userId:string, workspaceId:string)=>{
    const res = await prisma.workspaceInvitation.findMany({
        where : {
            invitedById: userId,
            workspaceId: workspaceId
        },
        select:{
            id: true,
            invitedToUser:{
                select:{
                    fullname: true,
                    email: true,
                    organization: true
                }
            },
            respondedAt: true,
            invitedRole: true,
            createdAt: true,
            status: true,
        }
    })

    return res.map((invitation)=>{
        return {
            id: invitation.id,
            invitedToName: invitation.invitedToUser.fullname,
            invitedToEmail:invitation.invitedToUser.email,
            invitedToOrg: invitation.invitedToUser.organization,
            invitedRole: invitation.invitedRole,
            status: invitation.status,
            respondedAt: invitation.respondedAt,
            createdAt: invitation.createdAt
        }
    })
}


export const delSentInvites = async (invitationId:string)=>{
    await prisma.workspaceInvitation.delete({
        where: { id: invitationId }
    })
}


export const getRecievedInvites = async (userId:string)=>{
    const res = await prisma.workspaceInvitation.findMany({
        where: { 
            invitedToId: userId,
            status: InvitationStatus.PENDING
        },
        select:{
            id: true,
            createdAt: true,
            status: true,
            invitedRole: true,
            workspace:{
                select: { 
                    title: true,
                    createdAt: true,
                    createdBy: true,
                }
            },
            invitedByUser:{
                select:{
                    fullname: true,
                }
            }
        }
    })

    return res.map((invitation)=>{
        return {
            id: invitation.id,
            createdAt: invitation.createdAt,
            status: invitation.status,
            invitedRole: invitation.invitedRole,
            workspaceTitle: invitation.workspace.title,
            workspaceCreatedAt: invitation.workspace.createdAt,
            workspaceCreatedBy: invitation.workspace.createdBy,
            invitedByName: invitation.invitedByUser.fullname
        }
    })
}


export const createInvite = async (
    invitedToId:string,
    invitedById:string,
    invitedRole:workRole,
    workspaceId:string
)=>{
    return await prisma.workspaceInvitation.create({
        data:{
            invitedById,
            invitedToId,
            invitedRole,
            workspaceId
        }
    })
}


export const acceptInviteAndCreateRole = async (invitationId:string, sentToId:string)=>{
    const joined = await prisma.$transaction(async (tx)=>{

        const findInvite = await tx.workspaceInvitation.findUnique({
            where: { id: invitationId },
            select:{
                invitedToId:true,
                workspaceId:true,
                invitedRole:true,
                status:true
            }
        })

        if (!findInvite) {
            throw new Error("Invitation not found");
        }

        if (findInvite.invitedToId !== sentToId) {
            throw new Error("You cannot accept this invitation");
        }

        if (findInvite.status !== "PENDING") {
            throw new Error("Invitation is no longer pending");
        }

        const role = await tx.role.create({
            data:{
                userId: findInvite?.invitedToId as string,
                workRole: findInvite?.invitedRole as workRole,
                workspaceId: findInvite?.workspaceId as string,
            }, 
            select:{
                workspace:{
                    select:{ id: true, title: true, createdAt:true }
                },
                workRole: true,
                status: true
            }
        })

        await tx.workspaceInvitation.update({
            where: { id: invitationId },
            data:{
                status: InvitationStatus.ACCEPTED,
                respondedAt: new Date()
            }
        })

        return role
    })

    return {
        id: joined.workspace.id,
        title: joined.workspace.title,
        role: joined.workRole,
        status: joined.status,
        createdAt: joined.workspace.createdAt
    }
}


export const declineInvitation = async (invitationId:string)=>{
    await prisma.workspaceInvitation.update({
        where: {id: invitationId },
        data:{
            status: InvitationStatus.DECLINED,
            respondedAt: new Date()
        }
    })
}