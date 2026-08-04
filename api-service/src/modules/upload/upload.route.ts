import { Router } from "express"
import { uploader } from "./multer.middleware"
import {
    fileUploadHandler,
    getUploadsHandler
} from "./upload.controller"

export const uploadRouter = Router()

uploadRouter.post("/", uploader.single("file"), fileUploadHandler)
uploadRouter.get("/files", getUploadsHandler)