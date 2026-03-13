import { NextRequest, NextResponse } from "next/server";


export const POST = async (req: NextRequest):Promise<NextResponse> => {
    try{
        const response = NextResponse.json({message: "Logout successful"}, {status: 200})
        response.cookies.set("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 0, // Expire the cookie immediately
        })
        return response;

    }catch{
            return NextResponse.json({error: "Internal server error"}, {status: 500})
    }
}