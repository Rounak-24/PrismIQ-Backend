import { Router } from "express"
import { jwtAuthMiddleware } from '../../middlewares/jwt.middleware'
import { uploader } from "./multer.middleware"
import {
    fileUploadHandler,
    getUploadsHandler
} from "./upload.controller"

export const uploadRouter = Router()

uploadRouter.post("/", jwtAuthMiddleware, uploader.single("file"), fileUploadHandler)
uploadRouter.get("/files", jwtAuthMiddleware, getUploadsHandler)