import express from "express"
import cors from "cors"
import type { Express, Request, Response } from "express"

import { authRouter } from "./modules/auth/auth.routes.js"

export const app:Express = express()

export const corsOptions = {
    origin:process.env.CORS_ORIGIN || "*",
    credentials:true
}

const logRequest = (req: Request, res: Response, next:Function)=>{
    console.log(`Time:${new Date(Date.now())} ,Request made to ${req.url}`)
    next()
}

app.use(logRequest)
app.use(express.json())
app.use(cors(corsOptions))

app.use("/auth",authRouter)
