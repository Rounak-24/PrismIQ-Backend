import { prisma } from "../../config/prisma"


export const getChatSessions = async (workspaceId:string)=>{
    return await prisma.conversation.findMany({
        where: { workspaceId},
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
            dashboards:{
                select:{
                    id: true,
                    title: true,
                    kpis: true,
                    charts: true,
                    insights: true
                }
            }
        }
    })

    return msgs.map((msg)=>{
        return {
            id: msg.id,
            sender: msg.senderType,
            text: msg.content,
            timestamp: msg.sentAt,
            dashboard: ( msg.dashboards!== null && { dashboard: msg.dashboards })
        }
    })
}