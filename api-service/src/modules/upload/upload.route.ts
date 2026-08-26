import { Router } from "express"
import { jwtAuthMiddleware } from '../../middlewares/jwt.middleware.js'
import { uploader } from "./multer.middleware.js"
import {
    fileUploadHandler,
    getUploadsHandler,
    delFileUploadHandler,
    startFileConvHandler
} from "./upload.controller.js"

export const uploadRouter = Router()

uploadRouter.post("/", jwtAuthMiddleware, uploader.single("file"), fileUploadHandler)
uploadRouter.get("/files", jwtAuthMiddleware, getUploadsHandler)
uploadRouter.post("/files/chat", jwtAuthMiddleware, startFileConvHandler)
uploadRouter.delete("/files/:id", jwtAuthMiddleware, delFileUploadHandler)