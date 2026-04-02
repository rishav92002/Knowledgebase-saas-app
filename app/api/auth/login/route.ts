import { NextRequest, NextResponse } from "next/server";
import { loginSchema, type LoginInput } from "@/lib/schemaValidators";
import { comparePassword } from "@/utils/hash";
import { generateToken } from "@/utils/token";
import prisma from "@/lib/prisma";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const body: LoginInput = await req.json();
        const isValidData = loginSchema.safeParse(body);
        if (!isValidData.success) {
            return NextResponse.json({error: "Invalid input data"}, {status: 400});
        }
        const user = await prisma.user.findUnique({
            where: { email: body.email }
        });
        if (!user) {
            return NextResponse.json({error: "Invalid email or password"}, {status: 400});
        }
        const isPasswordValid = await comparePassword(body.password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({error: "Invalid email or password"}, {status: 400});
        }
        const jwtToken = await generateToken({userId: user.id, email: user.email}, process.env.SECRET_KEY as string, "5h");
        const response = NextResponse.json({message: "Login successful"}, {status: 200});
        response.cookies.set("token", jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 5 * 60 * 60,
        });
        return response;
    } catch (e) {
        console.error("Login error:", e);
        return NextResponse.json({error: "Internal server error"}, {status: 500});
    }
};