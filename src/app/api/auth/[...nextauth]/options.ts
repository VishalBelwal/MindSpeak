import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnection"
import userModel from "@/model/User.model"

export const authOptions: NextAuthOptions = {
    providers: [
        //its a method gives access to objects 
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials:{
                email: { label: "Email", type: "text"},
                password: { label: "Password", type: "password", }
            },
            async authorize(credentials: any): Promise<any>{
                await dbConnect()
                
                try {
                    //finding user
                    const user = await userModel.findOne({
                        $or: [{email: credentials.identifier},{userName: credentials.identifier}]
                    })   //expected, user receivedPO

                    //but if not received then 
                    if(!user){
                        throw new Error("no user find with email")
                    }

                    //checking if user is verified or not
                    // if(!user.isVerified){
                    //     throw new Error("Please verify your account first")
                    // }

                    //checking password
                    const isPasswordCorrect =  await bcrypt.compare(credentials.password, user.password)
                    if(isPasswordCorrect){
                        return user
                    } else{
                    throw new Error("Incorrect Password")
                    }

                } catch (error: any) {
                    throw new Error(error)
                }
            }
        })
    ],
    callbacks: {
        async session({session, token}){
            if(token){
                session.user._id = token._id
                // session.user.isVerified = token.isVerified
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.userName = token.userName
            }
            return session
        },
        async jwt({token, user}){
            if(user){
                token._id = user._id?.toString()   //convering object id to string
                // token.isVerified = user.isVerified
                token.isAcceptingMessages = user.isAcceptingMessages
                token.userName = user.userName
            }

            return token
        }
    },
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXT_AUTH_SECRET
}