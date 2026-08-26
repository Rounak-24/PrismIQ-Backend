import { Redis } from "ioredis"
import { env } from "node:process"
import { config } from "dotenv"
config()

export const redis = new Redis(env.REDIS_URL as string, {
    maxRetriesPerRequest:null
})

redis.on("error", (err)=>{
    console.log(`Error in Redis connection: ${err}`)
})

redis.on("connect", ()=>{
    console.log(`Connected to Redis Store`)
})