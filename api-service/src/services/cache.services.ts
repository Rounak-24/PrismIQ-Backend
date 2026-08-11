import { redis } from '../config/redis'
import type { IcachedUser } from "../types/interfaces"
import { cacheField } from "../types/enums"


export function getKey(id:string){
    return `user:${id}`
}  


export const cacheUser = async (id:string, cache:IcachedUser)=>{
    try{
        await redis.hset(getKey(id), cache)
        await redis.expire(getKey(id), 12*60*60)
        console.log(`Cached User`, cache.emailVerified)

    } catch (err){
        console.log(`error occured while caching`, err)
    }
}


export const delCache = async (id:string)=>{
    try{
        await redis.del(getKey(id))

    } catch (err){
        console.log(`error occured while caching`, err)
    }
}

export const updateCache = async (cacheField:cacheField, data: any, id:string)=>{
    try{
        const cache = await redis.hgetall(getKey(id))
        if(!cache) return false
        
        const update = await redis.hset(getKey(id),cacheField, data)
        await redis.expire(getKey(id), 12*60*60)
        return (update===1)

    } catch (err){
        console.log(`error occured while updating cache`, err)
        return false
    }
}


export const getCachedField = async (userId:string, cacheField:cacheField)=>{
    return await redis.hget(getKey(userId),cacheField)
}

export const getAllCachedFields = async (userId:string)=>{
    return await redis.hgetall(getKey(userId))
}
    
