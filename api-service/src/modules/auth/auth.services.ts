import jwt, { type SignOptions, type Secret } from "jsonwebtoken"
import { prisma } from "../../config/prisma.js"
import { env } from "node:process"
import { redis } from "../../config/redis.js"
import { addEmailJob, emailQueueJob } from "../../queues/email/email.queue.js"
import { getVerifyEmailHTML, getPassResetOtpHTML } from "../../view/email.viewes"
import bcrypt from "bcrypt"
import crypto from "crypto"
import { getKey } from "../../services/cache.services.js"


interface IRegistrationData{
  name: string
  email: string
  password: string
  organization: string
}

interface ITempTokenObj {
    unHashedTempToken: string
    hashedTempToken: string
}

export enum authData {
    PASSWORD = "password",
    REFRESH_TOKEN = "refreshToken",
    EMAIL_VERIFIED = "emailVerified"
}

interface IupdateAuthData {
    password?:      string
    refreshToken?:  string | null
    emailVerified?:boolean
}

export const generateTokens = (id:string, name:string, email:string)=>{
    const accessToken = jwt.sign({
        id, email, name

    },env.JWT_SECRET_KEY as Secret, {
        expiresIn: env.ACCESS_TOKEN_EXPIRY
    } as SignOptions)

    const refreshToken = jwt.sign({
        id, email

    },env.JWT_SECRET_KEY as Secret, {
        expiresIn: env.REFRESH_TOKEN_EXPIRY
    } as SignOptions)

    return {accessToken, refreshToken}
}

export const validateRefreshToken = async (id:string, refreshToken: string|null)=>{
    const findInCache = await redis.hget(getKey(id), "refreshToken")

    if(!findInCache){
        const findInDB = await prisma.user.findUnique({
            where: { id:id },
            select:{ refreshToken: true}
        })

        if(!findInDB || findInDB.refreshToken!==refreshToken) return false

        return true
    }

    if(findInCache!==refreshToken) return false
    else return true
}

export const saveTokens = async (id:string, name:string, email:string)=>{
    const { accessToken, refreshToken } = generateTokens(id, name, email)
    await redis.hset(getKey(id), "refreshToken", refreshToken)

    const update = await prisma.user.update({
        where: {id: id},
        data:{ refreshToken: refreshToken}
    })
 
    return {
        id,
        refreshToken,
        accessToken
    }
}

const hashPassword = async (pass:string)=>{
    return await bcrypt.hash(pass,2)
}

export const comparePassword = async (pass:string, passwordHash:string)=>{
    return await bcrypt.compare(pass, passwordHash)
}

export const findUserByEmail = async(email:string)=>{
    return await prisma.user.findUnique({
        where: {email: email},
        select:{
            id: true,
            password: true,
            fullname: true,
            emailVerified: true,
            isActive: true
        }
    })
}


export const registerUser = async (registrstionData: IRegistrationData)=>{
    const { password } = registrstionData
    const passwordHash = await hashPassword(password)

    const createUser = await prisma.user.create({
        data:{
            fullname: registrstionData.name,
            password: passwordHash,
            email: registrstionData.email,
            organization: registrstionData.organization
        }
    })

    const {id, fullname, email, organization, emailVerified} = createUser

    return {
        id,
        name: fullname,
        email,
        organization,
        emailVerified
    }
}


function generateOTP():string {
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    return otp
}

function otpKey(email:string):string{
    return `otp:${email}`
}

function tokenKey(email:string):string {
    return `token:${email}`
}

function hash(otp:string) {
    return crypto.createHash('sha256')
        .update(otp)
        .digest('hex')
}

export const sendResetPassOTP = async (email:string)=>{
    const otp = generateOTP()
    const otpHash = hash(otp)
    
    await redis.set(otpKey(email),otpHash, 'EX', 4*60)
    const mailHTML = getPassResetOtpHTML(otp)
    
    await addEmailJob({
        email, 
        mailHTML:mailHTML,
        subject: "OTP for password reset request"
        
    }, emailQueueJob.SEND_PASS_RESET_OTP)

    console.log(`${emailQueueJob.SEND_PASS_RESET_OTP} Job enqueued to Queue`)
}

export const verifyResetPassOTP = async (email:string, otp:string)=>{
    const savedOTP = await redis.get(otpKey(email))

    if(!savedOTP) throw Error("OTP has been expired")
    if(savedOTP !== hash(otp)) throw Error("Invalid OTP")

    await redis.del(otpKey(email))
    return true
}


function generateTempToken():ITempTokenObj {
    const unHashedTempToken = crypto.randomBytes(20).toString('hex');

    const hashedTempToken = crypto.createHash('sha256')
        .update(unHashedTempToken)
        .digest('hex')

    return {hashedTempToken, unHashedTempToken}
}

export const sendVerifyEmail = async (email:string, fullname:string, baseURL:string)=>{
    const {unHashedTempToken, hashedTempToken} = generateTempToken() 
    const url = `${baseURL}?token=${unHashedTempToken}&email=${email}`

    await redis.set(tokenKey(email),hashedTempToken, 'EX', 24*60*60)
    const mailHTML = getVerifyEmailHTML(fullname, url)

    await addEmailJob({
        mailHTML:mailHTML, 
        email, 
        subject:"Email verification needed!"
    }, emailQueueJob.SEND_VERIFY_EMAIL)
}

export const verifyEmailToken = async (token:string, email:string)=>{
    const savedToken = await redis.get(tokenKey(email))
    console.log(token,"------",savedToken)
    if(!savedToken || (savedToken !== hash(token))) return false

    await redis.del(tokenKey(email))
    return true
}

export const updateAuthData = async (email:string, data:IupdateAuthData, type:authData)=>{
    switch(type){
        case("password"):
            await prisma.user.update({
                where: {email:email},
                data: {password: data.password as string}
            })
        
        case("refreshToken"):
            await prisma.user.update({
                where: { email:email },
                data: { refreshToken: data.refreshToken as string}
            })

        case("emailVerified"):
            return await prisma.user.update({
                where: { email:email },
                data: { emailVerified: data.emailVerified as boolean},
                select: { id: true }
            })
    }
}