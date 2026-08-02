import { Kafka, logLevel } from "kafkajs"

export const kafka = new Kafka({
    clientId:process.env.KAFKA_CLIENT || "localhost-client",
    brokers:["localhost:9092"],
    logLevel: logLevel.INFO
})