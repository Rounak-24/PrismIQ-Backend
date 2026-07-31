import { sendEmail } from "../../services/mail.services"
import { Job, Worker } from "bullmq"
import { redis } from "../../config/redis"


export const sendEmailWorker = new Worker("emails", async (job:Job)=>{
    const { mailHTML , email, subject } = job.data

    await sendEmail({
        mailHTML,
        email,
        subject
    })

    console.log(`Email Sent to ${email}`)

}, { connection: redis })

sendEmailWorker.on("completed", (job:Job)=>{
    console.log(`job completed`, job.id, job.name, job.data)
})

sendEmailWorker.on("failed", (job:any,err)=>{
    console.log(`job failed`, job.id, job.name, job.data)
    console.log(`Error occured, ${err}`)
})