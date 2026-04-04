import prisma from "@/lib/prisma";
import CreateDocument from "@/components/CreateDocument/CreateDocument";
import DocumentCard from "@/components/Cards/DocumentsCard";
import { getAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

async function Page({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ workspace: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { workspace } = await params;
  const { decoded } = await getAuth();
  const { q } = await searchParams;

  const workspaceData = await prisma.workspace.findMany({
    select: {
      id: true,
      name: true,
      documents: true,
    },
    where: { userId: decoded.userId },
  });

  const selectedWorkspace = workspaceData.find((ws) => ws.id === workspace);
  const filteredDocuments = selectedWorkspace?.documents.filter((doc) => {
    const searchStr = `${doc.name}`.toLowerCase();
    return searchStr.includes((q || "").toLowerCase());
  }) || [];
  if (!selectedWorkspace) {
    redirect("/dashboard/workspaces");
  }

  return (
    <div className="flex flex-col p-6 gap-8">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-xl text-foreground">
          Workspace &gt; {selectedWorkspace.name}
        </h1>
        <CreateDocument
          workspaces={workspaceData}
          preselectedWorkspaceId={selectedWorkspace.name}
        />
      </div>

      {filteredDocuments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted">
          <div className="w-14 h-14 rounded-full bg-muted-light/20 flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-light"
            >
              <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
            </svg>
          </div>
          <p className="text-lg font-medium">This workspace is empty</p>
          <p className="text-sm mt-1">
            Create your first document to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredDocuments.map((document) => (
            <DocumentCard
              key={document.id}
              id={document.id}
              name={document.name}
              title={document.title || ""}
              content={document.content || ""}
              workspaceId={selectedWorkspace.id}
              workspaceName={selectedWorkspace.name}
              updatedAt={document.updatedAt}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Page;