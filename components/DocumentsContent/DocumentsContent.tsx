"use client";

import React, { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DocumentCard from "@/components/Cards/DocumentsCard";
import CreateDocument from "@/components/CreateDocument/CreateDocument";
import UploadDocument from "@/components/UploadDocument/UploadDocument";

interface Workspace {
  id: string;
  name: string;
}

interface DocumentItem {
  id: string;
  name: string;
  title: string;
  content: string;
  workspaceId: string;
  workspaceName: string;
  updatedAt: Date;
  isFavourite: boolean;
}

interface DocumentsContentProps {
  documents: DocumentItem[];
  workspaces: Workspace[];
}

function DocumentSkeleton() {
  return (
    <div className="w-full bg-card-bg border border-card-border rounded-xl p-5 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-surface-hover shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-3/4 bg-surface-hover rounded" />
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-border-light flex items-center justify-between">
        <div className="flex gap-3">
          <div className="h-4 w-20 bg-surface-hover rounded" />
          <div className="h-4 w-14 bg-surface-hover rounded" />
        </div>
        <div className="h-7 w-14 bg-surface-hover rounded-lg" />
      </div>
    </div>
  );
}

const DocumentsContent = ({ documents, workspaces }: DocumentsContentProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [filteredDocuments, setFilteredDocuments] = useState(documents);
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const filtered = documents.filter((doc) => {
    const searchStr = `${doc.name}${doc.workspaceName}`.toLowerCase();
    return searchStr.includes(query.toLowerCase());
  });

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col p-6 gap-8">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-xl text-foreground">Your Documents</span>
        <div className="flex items-center gap-3">
          <UploadDocument workspaces={workspaces} onCreated={handleRefresh} />
          <CreateDocument workspaces={workspaces} onCreated={handleRefresh} />
        </div>
      </div>

      {filtered.length === 0 && !isPending ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted">
          <p className="text-lg font-medium">No documents Found</p>
          <p className="text-sm mt-1">Create your first document to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((doc) => (
            <DocumentCard
              key={doc.id}
              id={doc.id}
              name={doc.name}
              title={doc.title}
              content={doc.content}
              workspaceId={doc.workspaceId}
              workspaceName={doc.workspaceName}
              updatedAt={doc.updatedAt}
              isFavourite={doc.isFavourite}
            />
          ))}
          {isPending && <DocumentSkeleton />}
        </div>
      )}
    </div>
  );
};

export default DocumentsContent;
