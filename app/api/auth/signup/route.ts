import { NextResponse,NextRequest } from "next/server";
import { signUpSchema } from "@/lib/schemaValidators";
import { hashPassword } from "@/utils/hash";
import prisma from "@/lib/prisma";


export const POST = async (req: NextRequest): Promise<NextResponse> => {
    try{
        const body = await req.json()
        const isValidData = signUpSchema.safeParse(body);
        if(!isValidData.success){
            return NextResponse.json({error: "Invalid input data"}, {status: 400})
        }
        const existingUser = await prisma.user.findUnique({
            where: {
                email: body.email
            }
        })
        if(existingUser){
            return NextResponse.json({error: "User already exists"}, {status: 400})
        }
        const hashedpassword = await hashPassword(body.password, 10);
        const newuser = await prisma.user.create({
            data:{
                email: body.email,
                password: hashedpassword,
                name: body.name
            }
        })
        return NextResponse.json({message: "User created successfully", user: {email: newuser.email, name: newuser.name}}, {status: 201})
    }catch(e){
        return NextResponse.json({error: "Internal server error"}, {status: 500})
    }
}