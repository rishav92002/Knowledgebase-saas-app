import prisma from "@/lib/prisma";
import { getAuth } from "@/lib/auth";
import DocumentCard from "@/components/Cards/DocumentsCard";
import CreateDocument from "@/components/CreateDocument/CreateDocument";
import UploadDocument from "@/components/UploadDocument/UploadDocument";
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

  return (
    <div className="flex flex-col p-6 gap-8">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-xl text-foreground">Your Documents</span>
        <UploadDocument workspaces={workspacesData} />
        <CreateDocument workspaces={workspacesData} />
      </div>

      {documentsData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted">
          <p className="text-lg font-medium">No documents yet</p>
          <p className="text-sm mt-1">Create your first document to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {documentsData.map((doc) => (
            <DocumentCard
              key={doc.id}
              id={doc.id}
              name={doc.name}
              title={doc.title || ""}
              content={doc.content || ""}
              workspaceId={doc.workspaceId}
              workspaceName={doc.workspace.name}
              updatedAt={doc.updatedAt}
              isFavourite={doc.isFavourite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
