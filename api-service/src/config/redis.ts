import { Redis } from "ioredis"
import dotenv from "dotenv"
dotenv.config()

export const redis = new Redis(process.env.REDIS_URL as string, {
    maxRetriesPerRequest:null
})

redis.on("error", (err)=>{
    console.log(`Error in Redis connection: ${err}`)
})

redis.on("connect", ()=>{
    console.log(`Connected to Redis Store`)
})