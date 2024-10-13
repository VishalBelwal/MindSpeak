import dbConnect from "@/lib/dbConnection";
import userModel from "@/model/User.model";
import { Message } from "@/model/User.model";

export async function POST(request: Request) {
    await dbConnect()

    //send messages
    const { userName, content } = await request.json()
    try {
        const user = await userModel.findOne({ userName })
        if (!user) {
            return Response.json({
                success: false,
                message: "User Not found"
            }, { status: 404 })
        }

        //if we found the user then check weather the user is accepting messages or not
        if (!user.isAcceptingMessages) {
            return Response.json({
                success: false,
                message: "User Not accepting messages"
            }, { status: 403 })
        }

        const newMessage = {
            content, createdAt: new Date()
        }
        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json({
            success: true,
            message: "Message sent successfully"
        }, { status: 200 })
    } catch (error) {
        console.log("Error adding messages", error)
        return Response.json({
            success: false,
            message: "Error adding messages"
        }, { status: 500 })
    }
}