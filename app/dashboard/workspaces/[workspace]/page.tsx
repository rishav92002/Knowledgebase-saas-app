import prisma from "@/lib/prisma";
import CreateDocument from "@/components/CreateDocument/CreateDocument";
import DocumentCard from "@/components/Cards/DocumentsCard";
import { getAuth } from "@/lib/auth";

async function Page({ params }:{params:Promise<{workspace:string}>}) {
    const {workspace} = await params;
    const {decoded} = await getAuth();

    const workspaceData = await prisma.workspace.findMany({
        select: {
            id: true,
            name: true,
            documents: true,
        },
        where: { userId: decoded.userId },
    });
    const selectedWorkspace = workspaceData.find((ws) => ws.id === workspace);
    return <div className="flex flex-col p-6 gap-8">
        <div className="flex justify-between items-center">
            <h1 className="font-semibold text-xl">{'Workspace >'} {selectedWorkspace?.name}</h1>
            <CreateDocument workspaces={workspaceData} />
        </div> 
        <div>
            {selectedWorkspace?.documents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted">
                    <p className="text-lg font-medium">No documents yet</p>
                    <p className="text-sm mt-1">Create your first document to get started</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {selectedWorkspace?.documents.map((document) => (
                        <DocumentCard key={document.id} id={document.id} name={document.name} title={document.title || ""} content={document.content || ""} workspaceId={selectedWorkspace?.id} workspaceName={selectedWorkspace?.name} updatedAt={document.updatedAt} />
                    ))}
                </div>
            )}
        </div>
        
    </div>

}   

export default Page