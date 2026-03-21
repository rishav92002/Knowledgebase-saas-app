import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/utils/token";


const authMiddleware = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const token = req.cookies.get("token")?.value;
        console.log("Auth Middleware: Checking token", { token });
        if (!token) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
        const decoded = await verifyToken(token, process.env.SECRET_KEY as string);
        if (!decoded) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
        const requestHeaders = new Headers(req.headers);
        requestHeaders.set("x-user-id", decoded.userId);
        return NextResponse.next({
            request: { headers: requestHeaders },
        });
    } catch {
        return NextResponse.redirect(new URL("/login", req.url));
    }
};
export const config = {
  matcher: ["/api/workflow/:path*", '/api/document/:path*', '/api/auth/user'],
};
export default authMiddleware;