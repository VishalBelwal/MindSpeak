import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnection";
import userModel from "@/model/User.model";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request){
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

    const userID = new mongoose.Types.ObjectId(user._id)
    try {

        //getting messages (aggregation pipeline)
        const user = await userModel.aggregate([
            {
                //matching user with id amongst multiple users
                $match: {id: userID}
            },{
                //unwind the messages
                $unwind: '$messages'
            },{
                //sorting all the documents
                $sort: {'messages.createdAt': -1}
            }, {
                //grouping user
                $group: {_id: '$_id', messages: {$push: 'messages'}}
            }
        ])
        if(!user || user.length === 0){
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 401 })
        }

        return Response.json({
            success: true,
            messages: user[0].messages
        }, { status: 200 })
    } catch (error) {
        console.log("An unexpected error occoured", error)
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 500 })
    }
}