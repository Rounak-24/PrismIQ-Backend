import nodemailer, {type Transporter} from "nodemailer"

export interface IEmailOptionObj {
    mailHTML: string
    subject: string
    email: string
}

//For dev and testing using nodemailer local test account
import { createTransport, createTestAccount } from "nodemailer"

let transporter:Transporter|null = null

export const getTransporter = async ()=>{
    if (transporter) return transporter

    const testAccount = await createTestAccount()

    transporter = createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        }
    })

    return transporter
}

export const sendEmail = async (options:IEmailOptionObj)=>{
    const emailHTML = options.mailHTML

    const transporter = await getTransporter()

    const mail = {
        from:'Organisation@gmail.com',
        to:options.email,
        subject:options.subject,
        // text:emailText,
        html:emailHTML
    }

    try{
        const info = await transporter.sendMail(mail);
        console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`)

    }catch(err){
        console.log(err);
        console.log(`Error while sending email`);
    }
}

// export const sendEmail = async (from:string, to:string)=>{
//     try{
//         const { data, error } = await resend.emails.send({
//             from: 'Acme <onboarding@resend.dev>',
//             to: [to],
//             subject: 'Hello World',
//             html: '<strong>It works!</strong>',
//         })

//         if (error) {
//             throw error;
//         }

//         console.log({ data })

//     }catch(err){
//         console.log(`Error occured in sendEmail function`)
//     }
// }