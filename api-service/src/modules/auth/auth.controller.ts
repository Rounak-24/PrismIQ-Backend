import type { Request, Response } from "express"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { ApiError } from "../../utils/ApiError.js"
import { ApiResponse } from "../../utils/ApiResponse.js"

import { 
    registerUser, 
    saveTokens,
    findUserByEmail,
    comparePassword,
    verifyResetPassOTP,
    sendResetPassOTP,
    updateAuthData, authData,
    verifyEmail,
    deleteTokensFromCache,
    validateRefreshToken,
    sendVerifyEmail

} from "./auth.services.js"


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
    const { refreshToken, accessToken} = saveToken
    const { id, emailVeriified } = newUser

    res.status(200).json(
        new ApiResponse(200, {
            user:{
                id, 
                name: newUser.name,
                email: newUser.email,
                emailVeriified
            },
            accessToken: accessToken,
            refreshToken: refreshToken
            
        }, "Registration successful! Welcome to your workspace.")
    )

    const url = `${req.protocol}://${req.get("host")}/verify-email?token=unHashedTempToken`
    await sendVerifyEmail(email,name, url)

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

    const { id, fullname, emailVeriified } = exists
    const { accessToken, refreshToken } = await saveTokens(id, fullname, email)

    return res.status(200).json(
        new ApiResponse(200, {
            user:{
                id, 
                name: fullname,
                email, 
                emailVeriified
            },
            accessToken: accessToken,
            refreshToken: refreshToken
            
        }, "Registration successful! Welcome to your workspace.")
    )
})


export const logoutHandler = asyncHandler(async (req:Request, res:Response)=>{
    const { id, email } = req.user
    await deleteTokensFromCache(id)

    await updateAuthData(email, { refreshToken: null }, authData.REFRESH_TOKEN)

    return res.json( new ApiResponse(200, null,"Logged out successfully."))
})


export const refreshAccessHandler = asyncHandler(async (req:Request, res:Response)=>{
    const { id, fullname, email } = req.user 
    const correctToken = await validateRefreshToken(id, req.body.refreshToken)

    if(!correctToken){
        return res.json( new ApiError(401, "Invalid refreshToken, login again!"))
    }

    await deleteTokensFromCache(id)

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


export const verifyEmailHandler = asyncHandler(async (req:Request, res:Response)=>{
    const { token } = req.query
    const { email } = req.user

    if(!token) throw new ApiError(401,"Token not found")

    const isVerified = await verifyEmail(token as string, email)
    if(!isVerified) throw new ApiError(400,"Invalid Token or Token has been expired")
    
    await updateAuthData(email, { emailVeriified: true }, authData.EMAIL_VERIFIED)

    return res.status(200).json({
        success:true,
        message:"Email verified successfully!"
    })
})