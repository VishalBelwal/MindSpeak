import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnection";
import userModel from "@/model/User.model";
import { User } from "next-auth";

//POST request as when user click on toggle button he should change the request of accepting or not accepting the message
export async function POST(request: Request) {
    await dbConnect()

    //getting logged in user
    const session = await getServerSession(authOptions)

    //getting user
    const user: User = session?.user as User
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "User Not Authenticated"
        }, { status: 401 })
    }

    const userID = user._id

    //accepting usermessages from frontend
    const { userMessage } = await request.json()
    try {
        const updatedUSER = await userModel.findByIdAndUpdate(userID, { isAcceptingMessages: userMessage }, { new: true })

        if (!updatedUSER) {
            return Response.json({
                success: false,
                message: "failed to update user status to accept messages"
            }, { status: 401 })
        }

        return Response.json({
            success: true,
            message: "Message acceptance status updated successfully",
            updatedUSER
        }, { status: 200 })

    } catch (error) {
        console.log("failed to update user status to accept messages")
        return Response.json({
            success: false,
            message: "failed to update user status to accept messages"
        }, { status: 500 })
    }

}

export async function GET(request: Request) {
    await dbConnect()
    const session = await getServerSession(authOptions)

    const user = session?.user
    if (!session || !user) {
        return Response.json({
            success: false,
            message: "User Not Authenticated"
        }, { status: 401 })
    }
 
    try {
        const foundUser = await userModel.findById(user._id)

        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }

        return Response.json({
            success: true,
            message: "User found successfully",
            isAcceptingMessages: foundUser.isAcceptingMessages
        }, { status: 200 })
    } catch (error) {
        return Response.json({
            success: false,
            message: "Error in getting message acceptance status"
        }, { status: 500 })
    }
}