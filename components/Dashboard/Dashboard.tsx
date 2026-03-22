import prisma from "@/lib/prisma";
import { getAuth } from "@/lib/auth";
import DashBoardCard from "../Cards/DashBoardcard";
import { Icons } from "@/utils/icon";

export default async function Home() {
  const { user, decoded } = await getAuth();

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

  const workspaceLength = workspaces.length;
  const documentLength = workspaces.reduce((acc, cur) => acc + cur._count.documents, 0);

  return (
    <div className="flex flex-col p-6 bg-background gap-10">
      <h1 className="text-2xl font-bold text-foreground">
        Welcome, {user.name || user.email}
      </h1>
      <div className="flex gap-10">
        <DashBoardCard title="Workspaces" value={workspaceLength} icon={Icons.workspace()} />
        <DashBoardCard title="Documents" value={documentLength} icon={Icons.document()} />
      </div>
    </div>
  );
}