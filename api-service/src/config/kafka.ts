import { Kafka, logLevel } from "kafkajs"
import { env } from "node:process"

// export const kafka = new Kafka({
//     clientId:process.env.KAFKA_CLIENT || "localhost-client",
//     brokers:["localhost:9092"],
//     logLevel: logLevel.INFO,
//     retry: {
//         initialRetryTime: 100,
//         retries: 5 // Increase retries to give Kafka time to boot
//     }
// })

export const kafka = new Kafka({
    clientId:env.KAFKA_CLIENT_ID as string,
    brokers:[`${env.KAFKA_HOST}:${env.KAFKA_PORT}`],
    ssl:{
        rejectUnauthorized: false
    },
    sasl:{
        mechanism:'plain',
        username:env.KAFKA_USERNAME as string,
        password:env.KAFKA_PASSWORD as string
    },
    logLevel: logLevel.INFO,
    retry: {
        initialRetryTime: 100,
        retries: 5
    }
})