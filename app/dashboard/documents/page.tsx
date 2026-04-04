import prisma from "@/lib/prisma";
import { getAuth } from "@/lib/auth";
import DocumentsContent from "@/components/DocumentsContent/DocumentsContent";

export default async function Documents() {
  const { decoded } = await getAuth();

  const [documentsData, workspacesData] = await Promise.all([
    prisma.document.findMany({
      where: { workspace: { userId: decoded.userId } },
      select: {
        id: true,
        name: true,
        title: true,
        content: true,
        workspaceId: true,
        isFavourite: true,
        updatedAt: true,
        workspace: {
          select: { name: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.workspace.findMany({
      where: { userId: decoded.userId },
      select: {
        id: true,
        name: true,
      },
    }),
  ]);

  const formatted = documentsData.map((doc) => ({
    id: doc.id,
    name: doc.name,
    title: doc.title || "",
    content: doc.content || "",
    workspaceId: doc.workspaceId,
    workspaceName: doc.workspace.name,
    updatedAt: doc.updatedAt,
    isFavourite: doc.isFavourite,
  }));

  return <DocumentsContent documents={formatted} workspaces={workspacesData} />;
}
