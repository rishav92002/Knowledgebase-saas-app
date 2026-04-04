"use client";

import React, { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CreateWorkspace from "@/components/CreateWorkspace/CreateWorkspace";
import WorkspacesCard from "@/components/Cards/WorkspacesCard";

interface WorkspaceItem {
  id: string;
  name: string;
  updatedAt: Date;
  documentCount: number;
}

interface WorkspacesContentProps {
  workspaces: WorkspaceItem[];
}

function WorkspaceSkeleton() {
  return (
    <div className="bg-card-bg border border-card-border rounded-xl overflow-hidden w-56 animate-pulse">
      <div className="h-28 bg-surface-hover" />
      <div className="p-5 pt-8 space-y-3">
        <div className="h-5 w-3/4 bg-surface-hover rounded" />
        <div className="h-4 w-1/2 bg-surface-hover rounded" />
        <div className="h-4 w-2/3 bg-surface-hover rounded" />
        <div className="flex justify-end mt-4">
          <div className="h-8 w-16 bg-surface-hover rounded-lg" />
        </div>
      </div>
    </div>
  );
}

const WorkspacesContent = ({ workspaces }: WorkspacesContentProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const filtered = workspaces.filter((ws) => {
    const searchStr = `${ws.name}`.toLowerCase();
    return searchStr.includes(query.toLowerCase());
  });

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col p-4 gap-12">
      <div className="flex justify-between">
        <span className="font-semibold text-xl text-foreground">Your Workspaces</span>
        <CreateWorkspace onCreated={handleRefresh} />
      </div>

      {filtered.length === 0 && !isPending ? (
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
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </div>
          <p className="text-lg font-medium">No workspaces found</p>
          <p className="text-sm mt-1">Create a workspace to see it here</p>
        </div>
      ) : (
        <div className="flex gap-8 flex-wrap">
          {filtered.map((ws) => (
            <WorkspacesCard
              key={ws.id}
              id={ws.id}
              name={ws.name}
              updatedAt={ws.updatedAt}
              documentCount={ws.documentCount}
            />
          ))}
          {isPending && <WorkspaceSkeleton />}
        </div>
      )}
    </div>
  );
};

export default WorkspacesContent;
