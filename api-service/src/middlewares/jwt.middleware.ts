import jwt, {type Secret} from "jsonwebtoken"
import type {Request, Response, NextFunction} from "express"
import {env} from "node:process"

interface IjwtPayload{
    email: string,
    id: string,
    name:string
}

declare global{
    namespace Express{
        interface Request {
            user?:any
        }
    }
}

export const jwtAuthMiddleware = (req:Request, res:Response, next:NextFunction)=>{
    try{
        const auth = req.headers.authorization || req.cookies?.accessToken
        if(!auth) return res.status(401).json({"error":"Unauthorised request"})

        const token:string = auth.split(' ')[1]
        const decoded = jwt.verify(token, env.JWT_SECRET_KEY as Secret) as IjwtPayload

        const user = {
            id: decoded.id,
            email: decoded.email,
            fullname: decoded.name
        }

        console.log(`User has been authenticated`)
        req.user = user
        next()
    }catch(err){
        console.log(`Error occured in jwt middleware`, err)
        res.status(401).json({
            "seccess":false,
            "message":"JWT token is invalid or expired"
        })
    }
}