import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken, JwtPayload } from "@/utils/token";
import prisma from "@/lib/prisma";

export const getAuth = cache(async (): Promise<{
  user: { id: string; name: string | null; email: string };
  decoded: JwtPayload;
}> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  const decoded = await verifyToken(token, process.env.SECRET_KEY as string);
  if (!decoded) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: { id: true, name: true, email: true },
  });

  if (!user) {
    redirect("/login");
  }

  return { user, decoded };
});
