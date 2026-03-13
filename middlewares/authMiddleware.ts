import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/utils/token";


export const authMiddleware = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
        const isTokenValid = verifyToken(token, process.env.SECRET_KEY as string);
        if (!isTokenValid) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
        const requestHeaders = new Headers(req.headers);
        requestHeaders.set("userId", isTokenValid.userId);
        return NextResponse.next({
            request: { headers: requestHeaders },
        });
    } catch {
        return NextResponse.redirect(new URL("/login", req.url));
    }
};