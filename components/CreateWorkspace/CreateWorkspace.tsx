"use client";

import React, { useState } from "react";
import { Icons } from "@/utils/icon";
import axios from "axios";

const CreateWorkspace = () => {
  const [workspaceName, setWorkspaceName] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [workspaces, setWorkspaces]= useState(null)
  const [error, setError] = useState<string | null>(null);

  const handleCreateWorkflow = async () => {
    try{
        setIsLoading(true);
        const workspace = await axios.post('/api/workflow',{name:workspaceName})
        setIsOpen(false)
        setIsLoading(false);
        
    }catch(error){
        setError('Failed to create workflow!')
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
        <span className="text-sm font-medium">New Workspace</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => {
              setIsOpen(false);
              setError(null);
              setWorkspaceName("");
            }}
          />
          <div className="relative w-full max-w-md bg-surface border border-border rounded-xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-foreground">
                Create Workspace
              </h2>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setError(null);
                  setWorkspaceName("");
                }}
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

            <div className="space-y-2 mb-6">
              <label
                htmlFor="workspace-name"
                className="block text-sm font-medium text-foreground"
              >
                Workspace Name <span className="text-danger">*</span>
              </label>
              <input
                id="workspace-name"
                type="text"
                placeholder="e.g. My Project Notes"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-input-border bg-input-bg text-input-text placeholder-input-placeholder focus:outline-none focus:ring-2 focus:ring-input-focus focus:border-transparent transition"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setError(null);
                  setWorkspaceName("");
                }}
                className="px-4 py-2 rounded-lg border border-border text-foreground hover:bg-surface-hover transition-colors cursor-pointer text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateWorkflow}
                disabled={isLoading || workspaceName.trim().length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-text rounded-lg hover:bg-primary-hover transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed text-sm font-medium"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
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

export default CreateWorkspace;
