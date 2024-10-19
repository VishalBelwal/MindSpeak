import {resend} from "@/lib/resend"
import VerificationEmail from "../../emails/verifyEMAILS"
import { ApiResponse } from "@/types/ApiResponse"

export async function sendVerifyEmail(
    email: string,
    userName: string,
    otp: string
): Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'MindSpeak@resend.dev',
            to: email,
            subject: "MindSpeak Verification Email",
            react: VerificationEmail({username: userName, otp: otp})
        })

        return {success: true, message: "Verification email sent successfully"}
        
    } catch (emailError) {
        console.error("error sending verification email", emailError)
        return {success: false, message: "Failed to send verification email"}
    }
}
