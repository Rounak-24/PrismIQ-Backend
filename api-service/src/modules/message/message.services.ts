import { prisma } from "../../config/prisma.js"
import type { IMessage } from "../../types/interfaces.js";


export const saveMessage = async (data:IMessage)=>{
    const content = (data.content) ? data.content : null
    const senderName = data.senderName ?? null
    const date = new Date(data.sentAt)
    const dashboard = data.dashboard
    let savedMessage = null


    const targetConversationId = data.sessionId?.trim();
    console.log(`[Kafka Consumer] Verifying conversationId: "${targetConversationId}" exists...`);

    const conversationExists = await prisma.conversation.findUnique({
        where: { id: targetConversationId }
    });

    if (!conversationExists) {
        throw new Error(`Race condition: Conversation ${targetConversationId} not found in DB yet. Triggering Kafka retry.`);
    }
    
    try{
        if(dashboard){
            savedMessage = await prisma.message.create({
                data:{
                    conversationId: data.sessionId,
                    content: content,
                    senderType: data.senderType,
                    senderName: senderName,
                    sentAt: date,
                    dashboards: dashboard
                }
            })
        } else {
            savedMessage = await prisma.message.create({
                data:{
                    conversationId: data.sessionId,
                    content: content,
                    senderType: data.senderType,
                    senderName: senderName,
                    sentAt: date,
                }
            })
        }
        // console.log(savedMessage)
        if (savedMessage) return true
        else return false

    } catch(err){
        console.log(`Error occured while saving message to DB, ${err}`)
        return false
    }    
}