import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const GET = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const userId = req.headers.get("x-user-id");
        console.log('userId',userId)
        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }
        const user = await prisma.user.findUnique({
            where: { id: userId  },
            select: {
                id: true,
                email: true,
                name: true,
            },
        });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        return NextResponse.json({ user: {
            id: user.id,
            email: user.email,
            name: user.name,
        } });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
};
