import prisma from "@/lib/prisma";
import { getAuth } from "@/lib/auth";
import WorkspacesContent from "@/components/WorkspacesContent/WorkspacesContent";

export default async function Workspaces() {
  const { decoded } = await getAuth();

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

  const formatted = workspaces.map((ws) => ({
    id: ws.id,
    name: ws.name,
    updatedAt: ws.updatedAt,
    documentCount: ws._count.documents,
  }));

  return <WorkspacesContent workspaces={formatted} />;
}
