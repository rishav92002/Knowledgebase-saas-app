
import prisma from "@/lib/prisma"
import { getAuth } from "@/lib/auth"
import DocumentCard from "@/components/Cards/DocumentsCard";
export default async function Favourites(){
    const { decoded } = await getAuth();

    const [favouriteDocuments] = await Promise.all([
       prisma.document.findMany({
        where: { workspace: { userId: decoded.userId }, isFavourite: true },
        select: {
          id: true,
          name: true,
          title: true,
          content: true,
          workspaceId: true,
          updatedAt: true,
          isFavourite: true,
          workspace: {
            select: { name: true },
          },
        },
        orderBy: { updatedAt: "desc" },
      }),
    ])

    
    return <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 p-8">
          {favouriteDocuments?.map((doc) => (
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
}