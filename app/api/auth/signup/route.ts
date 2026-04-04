import { NextResponse, NextRequest } from "next/server";
import { signUpSchema, type SignupInput } from "@/lib/schemaValidators";
import { hashPassword } from "@/utils/hash";
import prisma from "@/lib/prisma";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const body: SignupInput = await req.json();
        const isValidData = signUpSchema.safeParse(body);
        if (!isValidData.success) {
            return NextResponse.json({error: "Invalid input data"}, {status: 400});
        }
        const existingUser = await prisma.user.findUnique({
            where: { email: body.email }
        });
        if (existingUser) {
            return NextResponse.json({error: "User already exists"}, {status: 400});
        }
        const hashedPassword = await hashPassword(body.password, 10);
        const newUser = await prisma.user.create({
            data: {
                email: body.email,
                password: hashedPassword,
                name: body.name
            }
        });
        return NextResponse.json({message: "User created successfully", user: {email: newUser.email, name: newUser.name}}, {status: 201});
    } catch (e) {
        return NextResponse.json({error: "Internal server error"}, {status: 500});
    }
};