
import { NextRequest, NextResponse } from "next/server";
import { hashPassword, comparePassword } from "@/utils/hash";
import prisma from "@/lib/prisma";

export const GET = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const userId = req.headers.get("x-user-id");
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

export const DELETE = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const userId = req.headers.get("x-user-id");
        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }
        await prisma.user.delete({
            where: { id: userId },
        });
        return NextResponse.json({ message: "User deleted successfully" });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
export const PATCH = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const userId = req.headers.get("x-user-id");
        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }
        const { name, email, oldPassword, newPassword } = await req.json();
        if (newPassword) {
            if (!oldPassword) {
                return NextResponse.json({ error: "Current password is required" }, { status: 400 });
            }
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { password: true },
            });
            if (!user) {
                return NextResponse.json({ error: "User not found" }, { status: 404 });
            }
            const isMatch = await comparePassword(oldPassword, user.password);
            if (!isMatch) {
                return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
            }
        }
        const data: Record<string, string> = {};
        if (name !== undefined) data.name = name;
        if (email !== undefined) data.email = email;
        if (newPassword) data.password = await hashPassword(newPassword, 10);

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data,
        });
        return NextResponse.json({
            message: "User updated successfully",
            user: {
                id: updatedUser.id,
                email: updatedUser.email,
                name: updatedUser.name,
            },
        });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
