import { Resend } from "resend"
import { env } from "node:process"
import { config } from "dotenv"
config()

export const resend = new Resend(env.RESEND_API_KEY)