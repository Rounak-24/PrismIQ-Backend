import { kafka } from "../config/kafka"
import { KAFKA_QUERY_TOPIC } from "../types/constants"
import { type IMessage } from "../types/interfaces"
import { saveMessage } from "../modules/message/message.services"

export const startMessageConsumer = async ()=>{
    const consumer = kafka.consumer({
        groupId:"default"
    })

    await consumer.connect()
    await consumer.subscribe({
        topic:KAFKA_QUERY_TOPIC,
        fromBeginning: true
    })

    await consumer.run({
        autoCommit: true,
        eachMessage: async ({message, pause})=>{
            console.log(`New message received....`)
            if(!message.value) return

            try{
                const msgValue = message.value.toString()
                const messageData:IMessage = JSON.parse(msgValue)
                console.log(messageData)

                const isSaved = await saveMessage(messageData)
                if(!isSaved) throw Error("Something went wrong while saving msg in DB")

            }catch(err){
                console.log(`Error occured for Kafka message consumer`)
                pause()
                setTimeout(()=>{
                    consumer.resume([{
                        topic: KAFKA_QUERY_TOPIC
                    }])
                }, 60*1000)
            }
        }
    })
}