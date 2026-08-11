import type { Request, Response } from "express"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { ApiError } from "../../utils/ApiError.js"
import { ApiResponse } from "../../utils/ApiResponse.js"
import { getVerificationSuccessHTML } from "../../view/email.viewes.js"
import { env } from "node:process"

import { 
    registerUser, 
    saveTokens,
    findUserByEmail,
    comparePassword,
    verifyResetPassOTP,
    sendResetPassOTP,
    updateAuthData, authData,
    verifyEmailToken,
    validateRefreshToken,
    sendVerifyEmail

} from "./auth.services.js"
import type { IcachedUser } from "../../types/interfaces.js";
import { cacheField, userStatus } from "../../types/enums.js";
import { cacheUser, delCache, updateCache } from "../../services/cache.services.js";


export const registerHandler = asyncHandler(async (req:Request, res:Response)=>{
    const {name, email, password, organization } = req.body

    if(!name || !email || !password || !organization) {
        throw new ApiError(400, "Sign-up credentials are missing") 
    }

    if(await findUserByEmail(email)){
        throw new ApiError(409, "This email is already registered. Redirecting to login...")
    } 

    const newUser = await registerUser({
        name, email, password, organization
    })

    if(!newUser){
        throw new ApiError(500, "Something went wrong while creating new user")
    }

    const saveToken = await saveTokens(newUser.id, name, email)
    const { refreshToken, accessToken } = saveToken
    const { id, emailVerified } = newUser

    res.status(200).json(
        new ApiResponse(200, {
            user:{
                id, 
                name: newUser.name,
                email: newUser.email,
                emailVerified
            },
            accessToken: accessToken,
            refreshToken: refreshToken
            
        }, "Registration successful! Welcome to your workspace.")
    )

    const cache:IcachedUser = {
        emailVerified: emailVerified,
        isActive: userStatus.ACTIVE,
        refreshToken: refreshToken,
        workspaces: null
    }

    await cacheUser(id, cache)

    const baseURL = `${req.protocol}://${req.get("host")}/api/v1/auth/verify-email`
    await sendVerifyEmail(email,name, baseURL)

    return
})


export const loginHandler = asyncHandler(async (req:Request, res:Response)=>{
    const {email, password} = req.body

    if(!email || !password ) {
        throw new ApiError(400, "Login credentials are missing") 
    }

    const exists = await findUserByEmail(email)
    if(!exists){
        throw new ApiError(404, "User not found")
    }

    if(!await comparePassword(password, exists.password)){
        throw new ApiError(400, "Incorrect Password")
    }

    const { id, fullname, emailVerified, isActive } = exists
    const { accessToken, refreshToken } = await saveTokens(id, fullname, email)

    res.status(200).json(
        new ApiResponse(200, {
            user: {
                id, 
                name: fullname,
                email, 
                emailVerified
            },
            accessToken: accessToken,
            refreshToken: refreshToken
            
        }, "Registration successful! Welcome to your workspace.")
    )

    const cache:IcachedUser = {
        emailVerified: emailVerified,
        isActive: (isActive) ? userStatus.ACTIVE : userStatus.INACTIVE,
        refreshToken,
        workspaces: null
    }

    await cacheUser(id, cache)
    return
})


export const logoutHandler = asyncHandler(async (req:Request, res:Response)=>{
    const { id, email } = req.user
    await delCache(id)

    await updateAuthData(email, { refreshToken: null }, authData.REFRESH_TOKEN)

    return res.json( new ApiResponse(200, null,"Logged out successfully."))
})


export const refreshAccessHandler = asyncHandler(async (req:Request, res:Response)=>{
    const { id, fullname, email } = req.user 
    const correctToken = await validateRefreshToken(id, req.body.refreshToken)

    if(!correctToken){
        return res.json( new ApiError(401, "Invalid refreshToken, login again!"))
    }

    const { accessToken, refreshToken } = await saveTokens(id, fullname, email)
    return res.json(
        new ApiResponse(200,{
            accessToken, refreshToken
        })
    )
})

export const forgotPassHandler = asyncHandler(async (req:Request, res:Response)=>{
    const { email } = req.body
    if(!email){
        throw new ApiError(400,"email is required for sending otp")
    }

    await sendResetPassOTP(email)
    res.status(200).json({ message:`A 6-digit verification code has been sent to your email.` })
})


export const verifyPassResetOTPHandler = asyncHandler(async (req:Request, res:Response)=>{
    const { otp, email } = req.body
    if(!otp) throw new ApiError(401,"OTP is required")

    await verifyResetPassOTP(email,otp)
    return res.status(200).json(`Security code verified successfully.`)
})


export const resetPassHandler = asyncHandler(async (req:Request, res:Response)=>{
    const { email, password, confirmPassword } = req.body

    if(password!==confirmPassword){
        throw new ApiError(400, "password and confirmPassword should be same")
    }

    await updateAuthData(email, password, authData.PASSWORD)

    return res.json(
        new ApiResponse(200, null, "password has been changed successfully")
    )
})


export const sendVerifyEmailHandler = asyncHandler(async (req:Request, res:Response)=>{
    const { id, email, name } = req.user
    if(!id || !email) throw new ApiError(402, "User data is missing")

    const baseURL = `${req.protocol}://${req.get("host")}/api/v1/auth/verify-email`
    await sendVerifyEmail(email, name, baseURL)

    return res.json( new ApiResponse(200, `Email verification sent to your email: ${email}`))
})


export const verifyEmailHandler = asyncHandler(async (req:Request, res:Response)=>{
    const { token, email } = req.query as { token:string, email:string }
    
    if(!email) throw new ApiError(401,"User not found")
    if(!token) throw new ApiError(401,"Token not found")
    
    const isVerified = await verifyEmailToken(token as string, email)
    if(!isVerified) throw new ApiError(400,"Invalid Token or Token has been expired")
    
    
    const updated = await updateAuthData(email, { emailVerified: true }, authData.EMAIL_VERIFIED)

    if(!updated) return res.status(500).json({"message":"Something went wrong while updating field"})
    else await updateCache(cacheField.EMAIL_VERIFIED, true, updated.id)

    console.log(`Verified email for ${email}`)
    return res.status(200).send(getVerificationSuccessHTML(env.APP_URL as string))
})