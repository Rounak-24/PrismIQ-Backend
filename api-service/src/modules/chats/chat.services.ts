import { prisma } from "../../config/prisma"


export const getChatSessions = async (workspaceId:string)=>{
    return await prisma.conversation.findMany({
        where: { workspaceId },
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
    const msgs = await prisma.message.findMany({
        where: { conversationId: sessionId },
        select: {
            id: true,
            content: true,
            senderType: true,
            senderName: true,
            sentAt:true,
            dashboard:true
        }
    })

    return msgs.map((msg)=>{
        return {
            id: msg.id,
            sender: msg.senderType,
            text: msg.content,
            timestamp: msg.sentAt,
            dashboard: ( msg.dashboard!== null && { dashboard: msg.dashboard })
        }
    })
}