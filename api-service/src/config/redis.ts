import { Redis } from "ioredis"
import { env } from "node:process"
import { config } from "dotenv"
import { hostname } from "node:os";
config()

export const redis = new Redis({
    host: "localhost",
    port: 6379,
    maxRetriesPerRequest: null
})

redis.on("error", (err)=>{
    console.log(`Error in Redis connection: ${err}`)
})

redis.on("connect", ()=>{
    console.log(`Connected to Redis Store`)
})