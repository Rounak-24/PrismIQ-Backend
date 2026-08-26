import { type Response, type Request, type NextFunction } from "express"
import { ApiError } from "./ApiError.js";

type asyncFunction = (req:Request, res:Response, next:NextFunction)=> any  
type asyncHandlerFunction = (fn:asyncFunction) => any

export const asyncHandler:asyncHandlerFunction = (fn:asyncFunction)=> 
    async (req:Request, res:Response, next?:NextFunction)=>{
    try{
        await fn(req,res,next as NextFunction)

    }catch(err){
        if(err instanceof ApiError){
            return res.json(err)
        }

        console.log(`Error in asyncHandler, ${err}`)
        res.status(500).json({
            Error:err as [],
        })
    }
}