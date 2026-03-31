import { getAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import DocumentPage from "@/components/DocumentComponents/DocumentPage";

export default async function DocumentRoute({
  params,
}: {
  params: Promise<{ document: string }>;
}) {
  const { document: documentId } = await params;
  const { decoded } = await getAuth();

  const documentData = await prisma.document.findUnique({
    where: { id: documentId },
    select: {
      id: true,
      name: true,
      title: true,
      content: true,
      workspace: {
        select: { userId: true },
      },
    },
  });

  if (!documentData || documentData.workspace.userId !== decoded.userId) {
    redirect("/dashboard/documents");
  }

  return (
    <DocumentPage
      documentData={{
        id: documentData.id,
        name: documentData.name,
        title: documentData.title,
        content: documentData.content,
      }}
    />
  );
}
