import dbConnect from "@/lib/dbConnection";
import userModel from "@/model/User.model";
import { Message } from "@/model/User.model";

// export async function POST(request: Request) {
//     await dbConnect()

//     //send messages
//     const { userName, content } = await request.json()
//     try {
//         const user = await userModel.findOne({ userName }).exec()
//         if (!user) {
//             return Response.json({
//                 success: false,
//                 message: "User Not found"
//             }, { status: 404 })
//         }

//         //if we found the user then check weather the user is accepting messages or not
//         if (!user.isAcceptingMessages) {
//             return Response.json({
//                 success: false,
//                 message: "User Not accepting messages"
//             }, { status: 403 })
//         }

//         const newMessage = {
//             content, createdAt: new Date()
//         }
//         user.messages.push(newMessage as Message)
//         await user.save()

//         return Response.json({
//             success: true,
//             message: "Message sent successfully"
//         }, { status: 200 })
//     } catch (error) {
//         console.log("Error adding messages", error)
//         return Response.json({
//             success: false,
//             message: "Error adding messages"
//         }, { status: 500 })
//     }
// }


export async function POST(request: Request) {
  await dbConnect();
  const { userName, content } = await request.json();

  try {
    const user = await userModel.findOne({ userName }).exec();

    if (!user) {
      return Response.json(
        { message: 'User not found', success: false },
        { status: 404 }
      );
    }

    // Check if the user is accepting messages
    if (!user.isAcceptingMessages) {
      return Response.json(
        { message: 'User is not accepting messages', success: false },
        { status: 403 } // 403 Forbidden status
      );
    }

    const newMessage = { content, createdAt: new Date() };

    // Push the new message to the user's messages array
    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json(
      { message: 'Message sent successfully', success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding message:', error);
    return Response.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}