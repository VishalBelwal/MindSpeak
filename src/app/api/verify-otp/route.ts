import userModel from "@/model/User.model";
import dbConnect from "@/lib/dbConnection";
import { z } from "zod"
import { userNameValidation } from "@/schemas/signUpSchema";

export async function POST(request: Request) {
    await dbConnect()

    try {
        const { userName, otp } = await request.json()
        const decodedUserName = decodeURIComponent(userName)   //to get perfect data from url
        const user = await userModel.findOne({ userName: decodedUserName })

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 500 })
        }

        const isValidCode = user.verifyCode === otp
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()
        if (isValidCode && isCodeNotExpired) {
            user.isVerified = true
            await user.save()
            return Response.json({
                success: true,
                message: "Account verified Successfully"
            }, { status: 200 })
        } else if(!isCodeNotExpired){
            return Response.json({
                success: false,
                message: "verification code is expired, please signup again"
            }, { status: 400 })
        } else{
            return Response.json({
                success: false,
                message: "incorrect verification code"
            }, { status: 400 })
        }

    } catch (error) {
        console.log("Error verifying user", error)
        return Response.json({
            success: false,
            message: "Error verifying user"
        }, { status: 500 })
    }
} 