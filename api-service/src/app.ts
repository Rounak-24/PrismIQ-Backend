import express from "express"
import cors from "cors"
import type { Express, Request, Response } from "express"

import { authRouter } from "./modules/auth/auth.routes.js"
import { workspaceRouter } from "./modules/workspace/workspace.routes.js"
import { chatRouter } from "./modules/chats/chat.routes.js"
import { uploadRouter } from "./modules/upload/upload.route.js"
import { userRouter } from "./modules/user/user.routes.js"

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
app.use("/user",userRouter)
app.use("/workspaces",workspaceRouter)
app.use("/upload",uploadRouter)
