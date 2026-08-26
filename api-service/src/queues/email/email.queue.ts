import { Queue } from "bullmq"
import { redis } from "../../config/redis.js"
import { type IEmailOptionObj } from "../../services/mail.services.js"

export enum emailQueueJob{
    SEND_VERIFY_EMAIL = "send-verify-email",
    SEND_INVITE_EMAIL = "send-invite-email",
    SEND_PASS_RESET_OTP = "send-pass-reseet-otp-email"
}

export const EmailQueue = new Queue("emails",{
    connection : redis
})


export const addEmailJob = async (data:IEmailOptionObj, jobType:emailQueueJob)=>{
    const { subject, email, mailHTML } = data

    await EmailQueue.add(jobType,{
        subject,
        email,
        mailHTML
    },{
        attempts:3,
        backoff:{
            type:"exponential",
            delay:1000
        }
    })

    console.log(`${jobType} Job enqueued to Queue`)
}