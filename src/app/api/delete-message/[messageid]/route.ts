import dbConnect from '@/lib/dbConnection';
import { User } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/options';
import userModel from '@/model/User.model';

export async function DELETE(request: Request, { params }: {
  params: { messageid: string }
}) {
  //extracting messageid
  const messageId = params.messageid
  await dbConnect();
  const session = await getServerSession(authOptions);
  const _user: User = session?.user as User;

  if (!session || !_user) {
    return new Response(JSON.stringify({ success: false, message: 'Not authenticated' }), { status: 401 });
  }

  try {
    const updatedRes = await userModel.updateOne(
      { _id: _user._id },
      { $pull: { messages: { _id: messageId } } }
    )
    if (updatedRes.modifiedCount === 0) {
      return new Response(JSON.stringify({ success: false, message: "Message not found or already deleted" }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true, message: "Message Deleted Successfully" }), { status: 200 })
  } catch (error) {
    console.log("Error in delete message route: ", error)
    return Response.json({
      success: false,
      message: "Error deleting message"
    }, { status: 500 })
  }

}