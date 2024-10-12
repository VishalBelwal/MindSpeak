import userModel from "@/model/User.model";
import dbConnect from "@/lib/dbConnection";
import { z } from "zod"
import { userNameValidation } from "@/schemas/signUpSchema";

const userNameQueryCheckSchema = z.object({
    userName: userNameValidation
})

//check if the user name is valid and if it exists or not
export async function GET(request: Request) {
    await dbConnect()

    try {
        //extracting query
        const { searchParams } = new URL(request.url)
        const queryParam = {
            userName: searchParams.get('userName')    //suspicious userName
        }

        //validate with zod
        const result = userNameQueryCheckSchema.safeParse(queryParam)
        console.log(result)

        if (!result.success) {
            const usernameError = result.error.format().userName?._errors || []  //getting errors
            return Response.json({
                success: false,
                message: usernameError?.length > 0 ? usernameError.join(', ') : "Invalid Username"
            }, { status: 400 })
        }

        const { userName } = result.data
        console.log(userName)

        const existingAndVerifiedUser = await userModel.findOne({ userName, isVerified: true })
        if (existingAndVerifiedUser) {
            return Response.json({
                success: false,
                message: "Username already taken"
            }, { status: 400 })
        }

        return Response.json({
            success: true,
            message: "Username Avialable"
        }, { status: 200 })

    } catch (error) {
        console.log("Error checking user name", error)
        return Response.json({
            success: false,
            message: "Error checking username"
        }, { status: 500 })
    }
}