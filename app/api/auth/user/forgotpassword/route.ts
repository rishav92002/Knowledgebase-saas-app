import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import crypto, { hash } from "crypto";
import { hashPassword } from "@/utils/hash";



export const POST = async (req: NextRequest): Promise<NextResponse> => {
    try{
        const { email } = await req.json();
        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (user) {
            const resetToken = crypto.randomBytes(32).toString("hex");
            const resetTokenExpiry = new Date(Date.now() + 900000);
            const hashedToken = await hashPassword(resetToken, 10);
            await prisma.user.update({
                where: { email },
                data: {
                    resetToken: hashedToken,
                    resetTokenExpiry: resetTokenExpiry,
                },
            });
        }
        return NextResponse.json({ message: "If an account with that email exists, a password reset link has been sent." });

    }catch(e){
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}