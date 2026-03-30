"use client";

import React, { useState } from "react";
import { Icons } from "@/utils/icon";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Workspace {
  id: string;
  name: string;
}

interface CreateDocumentProps {
  workspaces: Workspace[];
  preselectedWorkspaceId?: string;
}

const CreateDocument = ({ workspaces, preselectedWorkspaceId }: CreateDocumentProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [docName, setDocName] = useState("");
  const [docTitle, setDocTitle] = useState("");     
  const [selectedWorkspaceName, setSelectedWorkspaceName] = useState(preselectedWorkspaceId || "");
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [useNewWorkspace, setUseNewWorkspace] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const resetForm = () => {
    setDocName("");
    setDocTitle("");
    setSelectedWorkspaceName( "");
    setNewWorkspaceName("");
    setUseNewWorkspace(false);
    setError(null);
  };

  const hasValidWorkspace = useNewWorkspace
    ? newWorkspaceName.trim().length > 0
    : selectedWorkspaceName.length > 0;

  const handleCreate = async () => {
    if (!docName.trim()) return;
    if (!hasValidWorkspace) {
      setError(useNewWorkspace ? "Please enter a workspace name" : "Please select a workspace");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const body: Record<string, string | undefined> = {
        name: docName.trim(),
        title: docTitle.trim() || undefined,
      };

      if (useNewWorkspace) {
        body.workspaceName = newWorkspaceName.trim();
      } else {
        body.workspaceName = selectedWorkspaceName;
      }

      await axios.post("/api/document", body);
      setIsOpen(false);
      resetForm();
      router.refresh();
    } catch {
      setError("Failed to create document");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-text rounded-lg hover:bg-primary-hover transition-colors cursor-pointer"
      >
        {Icons.plus({ size: 18 })}
        <span className="text-sm font-medium">New Document</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => { setIsOpen(false); resetForm(); }}
          />
          <div className="relative w-full max-w-md bg-surface border border-border rounded-xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-foreground">
                Create Document
              </h2>
              <button
                onClick={() => { setIsOpen(false); resetForm(); }}
                className="text-muted hover:text-foreground transition-colors cursor-pointer"
              >
                {Icons.close({ size: 20 })}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div className="space-y-2">
                <label htmlFor="doc-name" className="block text-sm font-medium text-foreground">
                  Document Name <span className="text-danger">*</span>
                </label>
                <input
                  id="doc-name"
                  type="text"
                  placeholder="e.g. Getting Started Guide"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-input-border bg-input-bg text-input-text placeholder-input-placeholder focus:outline-none focus:ring-2 focus:ring-input-focus focus:border-transparent transition"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="doc-title" className="block text-sm font-medium text-foreground">
                  Title
                </label>
                <input
                  id="doc-title"
                  type="text"
                  placeholder="e.g. A beginner's guide to..."
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-input-border bg-input-bg text-input-text placeholder-input-placeholder focus:outline-none focus:ring-2 focus:ring-input-focus focus:border-transparent transition"
                />
              </div>

              {!preselectedWorkspaceId && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-foreground">
                      Workspace <span className="text-danger">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setUseNewWorkspace((prev) => !prev);
                        setSelectedWorkspaceName("");
                        setNewWorkspaceName("");
                      }}
                      className="text-xs text-primary hover:text-primary-hover font-medium cursor-pointer transition-colors"
                    >
                      {useNewWorkspace ? "Choose existing" : "Create new"}
                    </button>
                  </div>

                  {useNewWorkspace ? (
                    <input
                      type="text"
                      placeholder="e.g. My New Workspace"
                      value={newWorkspaceName}
                      onChange={(e) => setNewWorkspaceName(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-input-border bg-input-bg text-input-text placeholder-input-placeholder focus:outline-none focus:ring-2 focus:ring-input-focus focus:border-transparent transition"
                    />
                  ) : (
                    <select
                      id="doc-workspace"
                      value={selectedWorkspaceName}
                      onChange={(e) => setSelectedWorkspaceName(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-input-border bg-input-bg text-input-text focus:outline-none focus:ring-2 focus:ring-input-focus focus:border-transparent transition appearance-none cursor-pointer"
                    >
                      <option value="">Select a workspace</option>
                      {workspaces.map((ws) => (
                        <option key={ws.id} value={ws.name}>
                          {ws.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => { setIsOpen(false); resetForm(); }}
                className="px-4 py-2 rounded-lg border border-border text-foreground hover:bg-surface-hover transition-colors cursor-pointer text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={isLoading || docName.trim().length === 0 || !hasValidWorkspace}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-text rounded-lg hover:bg-primary-hover transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed text-sm font-medium"
              >
                {isLoading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating...
                  </>
                ) : (
                  "Create"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateDocument;
