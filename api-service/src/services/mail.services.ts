import { Resend } from "resend"
import { env } from "node:process"
import { config } from "dotenv"
config()

export interface IEmailOptionObj {
    mailHTML: string
    subject: string
    email: string
}


export const resend = new Resend(env.RESEND_API_KEY)

export const sendEmail = async (options:IEmailOptionObj)=>{
    try{
        const { data, error } = await resend.emails.send({
            from: env.ORG_EMAIL as string,
            to: [options.email],
            subject: options.subject,
            html: options.mailHTML,
        })

        if (error)  throw error
        console.log({ data })

    }catch(err){
        console.log(`Error occured in sendEmail function`,err)
    }
}


//For dev and testing using nodemailer local test account
// import nodemailer, {type Transporter} from "nodemailer"
// import { createTransport, createTestAccount } from "nodemailer"
// let transporter:Transporter|null = null
// export const getTransporter = async ()=>{
//     if (transporter) return transporter
//     const testAccount = await createTestAccount()
//     transporter = createTransport({
//         host: testAccount.smtp.host,
//         port: testAccount.smtp.port,
//         secure: testAccount.smtp.secure,
//         auth: {
//             user: testAccount.user,
//             pass: testAccount.pass,
//         }
//     })
//     return transporter
// }
// export const sendEmail = async (options:IEmailOptionObj)=>{
//     const emailHTML = options.mailHTML

//     const transporter = await getTransporter()

//     const mail = {
//         from:'Organisation@gmail.com',
//         to:options.email,
//         subject:options.subject,
//         // text:emailText,
//         html:emailHTML
//     }

//     try{
//         const info = await transporter.sendMail(mail);
//         console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`)

//     }catch(err){
//         console.log(err);
//         console.log(`Error while sending email`);
//     }
// }