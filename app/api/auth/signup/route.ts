import { NextResponse,NextRequest } from "next/server";
import { signUpSchema } from "@/lib/schemaValidators";
import prisma from "@/lib/prisma";


export const Post = async (req: NextRequest) => {
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
        const newuser = await prisma.user.create({
            data:{
                email: body.email,
                password: body.password,
                name: body.name
            }
        })
        return NextResponse.json({message: "User created successfully", user: newuser}, {status: 201})
    }catch(e){
        return NextResponse.json({error: "Internal server error"}, {status: 500})
    }
}