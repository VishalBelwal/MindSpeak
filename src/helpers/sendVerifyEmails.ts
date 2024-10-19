import {resend} from "@/lib/resend"
import VerificationEmail from "../../emails/verifyEMAILS"
import { ApiResponse } from "@/types/ApiResponse"

export async function sendVerifyEmail(
    email: string,
    userName: string,
    otp: string
): Promise<ApiResponse>{
    try {
        const reponse = await resend.emails.send({
            from: 'Acme <MindSpeak@resend.dev>',
            to: email,
            subject: "MindSpeak Verification Email",
            react: VerificationEmail({username: userName, otp: otp})
        })

        console.log("Resend API Response:", reponse);

        return {success: true, message: "Verification email sent successfully"}
        
    } catch (emailError) {
        console.error("error sending verification email", emailError)
        return {success: false, message: "Failed to send verification email"}
    }
}
