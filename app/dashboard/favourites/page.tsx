
import prisma from "@/lib/prisma"
import { getAuth } from "@/lib/auth"
import DocumentCard from "@/components/Cards/DocumentsCard";
export default async function Favourites({searchParams}: { searchParams: { q?: string } }) {
    const { decoded } = await getAuth();
    const { q } = await searchParams;

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
    const filteredDocuments = favouriteDocuments.filter((doc) => {
      const searchStr = `${doc.name}${doc.workspace.name}`.toLowerCase();
      return searchStr.includes((q || "").toLowerCase());
    });
    
    return (
      <div className="flex flex-col p-6 gap-8">
        <span className="font-semibold text-xl text-foreground">Your Favourites</span>

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
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <p className="text-lg font-medium">No favourites yet</p>
            <p className="text-sm mt-1">
              Star a document to see it here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredDocuments.map((doc) => (
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
    )
}