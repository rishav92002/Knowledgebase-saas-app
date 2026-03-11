import {z} from "zod";


export const signUpSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(100),
    name: z.string().min(2).max(50),
})
export type SignupInput = z.infer<typeof signUpSchema>