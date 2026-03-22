import { cookies } from "next/headers";
import { verifyToken } from "@/utils/token";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import DashBoardCard from "../Cards/DashBoardcard";
import { Icons } from "@/utils/icon";

export default async function Home() {
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
  const workspaces = await prisma.workspace.findMany({
      where: { userId: decoded.userId },
      select: {
        id: true,
        name: true,
        updatedAt: true,
        _count: {
          select: { documents: true },
        },
      },
    });
  console.log('workspaces',workspaces)
  const workspaceLength = workspaces.length;
  const documentLength = workspaces.reduce((acc, cur) => acc + cur._count.documents, 0);
  return (
    <div className="flex flex-col p-6 bg-background gap-10">
      <h1 className="text-2xl font-bold text-foreground">
        Welcome, {user.name || user.email}
      </h1>
      <div className="flex gap-10">
        <DashBoardCard title = {'Workspaces'} value = {workspaceLength} icon={Icons.workspace()}/>
        <DashBoardCard title = {'Documents'} value = {documentLength} icon = {Icons.document()}/>
        
      </div>
    </div>
  );
}