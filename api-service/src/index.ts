import { app } from "./app.js"
import { createServer } from "http"
import { startMessageConsumer } from "./services/kafkaConsumer.services.js"
import { initQueueWorker } from './queues/email/worker.js'
import dotenv from "dotenv"
dotenv.config()

const port = process.env.PORT as string || 3000

async function init() {
    try{
        const httpServer = createServer(app)

        httpServer.on("error" as "mount",(err)=>{
            console.log(err)
            throw err
        })

        httpServer.listen(port,()=>{
            console.log(`API Server is listening on port ${port}`)
        })

        initQueueWorker()
        startMessageConsumer()
        

    }catch(err){
        console.log(`Error occured while starting server, ${err}`)
        process.exit(1)
    }
}

init()
app.get('/health',(req,res)=>{
    res.send(`API Service is up & running`)
})