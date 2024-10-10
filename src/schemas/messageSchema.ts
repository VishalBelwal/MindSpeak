import { z } from "zod"

export const messageSchema = z.object({
    content: z.string().min(1, { message: "Content must be atleast of 1 characters" }).max(500,
        { message: "Content must be no longer than 500 characters" }
    )
})