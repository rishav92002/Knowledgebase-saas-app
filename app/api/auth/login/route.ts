import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/schemaValidators";
import { comparePassword } from "@/utils/hash";
import { generateToken } from "@/utils/token";
import prisma from "@/lib/prisma";



export const POST = async (req:NextRequest): Promise<NextResponse> => {
    try{
        const body = await req.json();
        const isValidData = loginSchema.safeParse(body);
        console.log('isValidData', isValidData)
        if(!isValidData.success){
            return NextResponse.json({error: "Invalid input data"}, {status: 400})
        }
        const user  = await prisma.user.findUnique({
            where: {
                email: body.email
            }
        })
        console.log('isValidData1', user)
        if(!user){
            return NextResponse.json({error: "Invalid email or password"}, {status: 400});
        }
        const isPasswordValid = await comparePassword(body.password, user.password);
        console.log('isValidData2', isPasswordValid)
        if(!isPasswordValid){
            return NextResponse.json({error: "Invalid email or password"}, {status: 400});
        }
        const jwtToken = generateToken({userId: user.id, email: user.email}, "JWT_SECRET_KEY", "5h");
        console.log('isValidData3', jwtToken)
       const response =  NextResponse.json({message: "Login successful"}, {status: 200})
       console.log('isValidData3', response)
       response.cookies.set("token", jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 5 * 60 * 60, // 5 hours in seconds
       })
       return response;


    }catch(e){
        return NextResponse.json({error: "Internal server error"}, {status: 500})
    }
}