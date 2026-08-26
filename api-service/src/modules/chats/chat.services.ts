import { prisma } from "../../config/prisma.js"


export const createChat = async (workspaceId:string, title:string)=>{
    return await prisma.conversation.create({
        data:{
            workspaceId: workspaceId,
            title: title
        }, select:{
            id: true,
            title: true,
            workspaceId: true,
            createdAt: true
        }
    })
}


export const getChatSessions = async (workspaceId:string)=>{
    return await prisma.conversation.findMany({
        where: { workspaceId, fileuploadId: null },
        select: {
            id: true,
            title: true,
            workspaceId: true,
            createdAt: true,
        }
    })
}

export const delChatSession = async (sessionId:string)=>{
    await prisma.conversation.delete({ where: { id: sessionId }})
}

export const getMessages = async (sessionId:string)=>{
    return await prisma.message.findMany({
        where: { conversationId: sessionId },
        select: {
            id: true,
            content: true,
            senderType: true,
            senderName: true,
            sentAt:true,
            dashboards:true
        }
    })
}

export const updateChatTitle = async (sessionId:string, newTitle:string)=>{
    return prisma.conversation.update({
        where:{ id: sessionId },
        data:{
            title: newTitle
        }, 
        omit: { updatedAt: true }
    })
}