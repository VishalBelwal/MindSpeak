import dbConnect from "@/lib/dbConnection";
import userModel from "@/model/User.model";
import bcrypt from "bcryptjs"
import { sendVerifyEmail } from "@/helpers/sendVerifyEmails";

export async function POST(request: Request) {
    await dbConnect()

    try {
        const { userName, email, password } = await request.json()

        if (!email) {
            return Response.json(
                {
                    success: false,
                    message: 'Email is required',
                },
                { status: 400 }
            );
        }

        const existingUserVerifiedbyUsername = await userModel.findOne({ userName })

        if (existingUserVerifiedbyUsername) {
            return Response.json({
                success: false,
                message: "Username already taken"
            }, { status: 400 })
        }

        const existingUserbyEmail = await userModel.findOne({ email })

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if (existingUserbyEmail) {
            if (existingUserbyEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "User already exist with this email"
                }, { status: 400 })
            } else {
                //if user changing password
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserbyEmail.password = hashedPassword
                existingUserbyEmail.verifyCode = verifyCode
                existingUserbyEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)

                //saving user
                await existingUserbyEmail.save()
            }
        } else {
            const hashpassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()   //yaha par date hame as an object mil rahi hai aur uspar const, let etc ka koi effect nahi hota
            expiryDate.setHours(expiryDate.getHours() + 1)

            //creating new user
            const newUser = new userModel({
                userName,
                email,
                password: hashpassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                messages: []
            })

            //saving the user
            await newUser.save()

        }

        //sending verification email
        const emailResponse = await sendVerifyEmail(email, userName, verifyCode)

        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, { status: 500 })
        }

        return Response.json({
            success: true,
            message: "User registered successfully, please verify your email, Redirecting to Sign In page.",
            redirectUrl: '/sign-in'
        }, { status: 201 })

    } catch (error) {
        console.error('Error regestring user')
        return Response.json({
            success: false,
            message: "Error regestring user"
        }, {
            status: 500
        })
    }
}