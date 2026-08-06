import { prisma } from "../../config/prisma"
import type { IMessage } from "../../types/interfaces";


export const saveMessage = async (data:IMessage)=>{
    const dashboard = (data.dashboard) ? data.dashboard : null
    const content = (data.content) ? data.content : null
    const senderName = data.senderName ?? null

    const savedMessage = await prisma.message.create({
        data:{
            conversationId: data.sessionId,
            content: content,
            senderType: data.senderType,
            senderName: senderName,
            sentAt: data.sentAt,
            dashboards: dashboard ?? []
        }
    })

    console.log(savedMessage)
    if (savedMessage) return true
    else return false
}