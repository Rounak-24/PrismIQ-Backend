import multer from "multer"

export const storage = multer.diskStorage({
    filename: function (req,file, cb){
        const uniqueSuffix = Date.now() + '-' + Math.random()*2
        cb(null, file.originalname + '-' + uniqueSuffix)
    },

    destination: function (req,file,cb){
        cb(null, './public/uploads')
    }
})

export const uploader = multer({ 
    storage: storage,
    limits: {
        fileSize: 10*1024*1024   //10 MB
    }
})