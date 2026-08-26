import express from "express"
import cors from "cors"
import type { Express, Request, Response } from "express"
import dotenv from "dotenv"
dotenv.config()

import { authRouter } from "./modules/auth/auth.routes.js"
import { workspaceRouter } from "./modules/workspace/workspace.routes.js"
import { chatRouter } from "./modules/chats/chat.routes.js"
import { uploadRouter } from "./modules/upload/upload.route.js"
import { userRouter } from "./modules/user/user.routes.js"
import { dashboardRouter } from "./modules/dashboard/dashboard.routes.js"
import { invitationRouter } from "./modules/invite/invite.routes.js"

export const app:Express = express()

export const corsOptions = {
    origin:process.env.CORS_ORIGIN,
    credentials:true
}

const logRequest = (req: Request, res: Response, next:Function)=>{
    console.log(`Time:${new Date(Date.now())} ,Request made to ${req.method} ${req.url}`)
    next()
}

app.use(logRequest)
app.use(express.json())
app.use(cors(corsOptions))

app.use("/api/v1/auth",authRouter)
app.use("/api/v1/users",userRouter)
app.use("/api/v1/workspaces",workspaceRouter)
app.use("/api/v1/upload",uploadRouter)
app.use("/api/v1/chat",chatRouter)
app.use("/api/v1/dashboards",dashboardRouter)
app.use("/api/v1/invitation",invitationRouter)