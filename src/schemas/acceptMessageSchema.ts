import {z} from "zod"

export const acceptMessagesSchema = z.object({
    acceptMessage: z.boolean()
})