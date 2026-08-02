import { prisma } from "../../config/prisma"
import {type IQueryPayload} from "../../types/interfaces"
import { messageSender } from '../../types/enums'

export const saveMessage = async(payload:IQueryPayload)=>{
    const { sessionId, senderName, sentAt, aiResponse, query } = payload
    const aiResponseObj = JSON.parse(aiResponse)

    await prisma.message.createMany({
        data:[
            {
                conversationId: sessionId,
                content: query,
                senderType: messageSender.USER,
                sentAt: sentAt,
                senderName: senderName
            },
            {
                conversationId: sessionId,
                content: aiResponse,
                senderType: messageSender.AI,
                sentAt: sentAt,
                senderName:"AI Agent",
                dashboards: ("dashboard" in aiResponseObj) ? [aiResponseObj.dashboard] : null
            }
        ]
    })

    return true
}
